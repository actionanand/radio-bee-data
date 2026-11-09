import csv
import io
import json
from pathlib import Path
import sys
import tempfile
import unittest
import importlib.util
import os
from unittest.mock import patch
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'scripts'))
import radiobee_radio_browser_audit as collector
import radiobee_ffmpeg_audit as decoder
from research_safety import spreadsheet_cell


class ResearchSafetyTests(unittest.TestCase):
    def test_review_logo_manifest_escapes_directory_uuid_without_network(self):
        spec=importlib.util.spec_from_file_location('logo_collector',Path(__file__).resolve().parents[1]/'scripts/collect-logo-candidates.py')
        logos=importlib.util.module_from_spec(spec);spec.loader.exec_module(logos)
        with tempfile.TemporaryDirectory(dir='reports') as directory:
            inp=Path(directory)/'input.csv';out=Path(directory)/'review'
            with inp.open('w',newline='') as f:
                writer=csv.DictWriter(f,fieldnames=['radiobee_id','countrycode','favicon','stationuuid']);writer.writeheader();writer.writerow({'radiobee_id':'air-nagercoil','countrycode':'IN','favicon':'https://radio.example/logo.png','stationuuid':'=evil'})
            with patch.object(sys,'argv',['logos','--input',str(inp),'--output',str(out)]),patch.object(logos.subprocess,'run',side_effect=AssertionError('offline manifest must not fetch')):
                logos.main()
            with (out/'manifest.csv').open(newline='') as f:
                self.assertEqual(next(csv.DictReader(f))['station_uuid'],"'=evil")

    def test_cells(self):
        for value in ['=1+1','+SUM(1,2)','-1+2','@SUM(1,2)',' \t=cmd','\ufeff=1','\x00=1','\r=1','\ntext','\ttext']:
            self.assertEqual(spreadsheet_cell(value),"'"+value)
        for value in ['Tamil FM','https://radio.example/live',3,None]:
            self.assertEqual(spreadsheet_cell(value),value)

    def test_export_and_original_json(self):
        row=collector.normalize({'name':'=HYPERLINK("bad")','url':'https://radio.example/live','tags':' +cmd','country':'@evil','votes':1},set())
        original=dict(row)
        with tempfile.TemporaryDirectory() as directory:
            prefix=Path(directory)/'test'
            row['radiobee_status']='discovery-only'
            original=dict(row)
            collector.export([row],prefix)
            for suffix in ['.csv','_priority.csv']:
                with Path(str(prefix)+suffix).open(newline='') as file:
                    saved=next(csv.DictReader(file))
                for field in ['name','tags','country']:
                    self.assertEqual(saved[field],"'"+row[field])
            self.assertEqual(json.loads(Path(str(prefix)+'.json').read_text())[0],row)
            self.assertEqual(row,original)

    def test_default_decoder_cannot_spawn_network(self):
        with patch.object(decoder,'safe_request',side_effect=AssertionError('must not fetch')):
            self.assertEqual(decoder.test_one({'stream_url':'https://public.example/live'},2,45)['ffmpeg_status'],'blocked-review-required')

    def test_explicit_sample_workflow_and_csv_headers(self):
        row={'stream_url':'https://radio.example/live','name':'=evil','description':'\t@evil','=header':'-evil'}
        with tempfile.TemporaryDirectory() as directory:
            inp=Path(directory)/'in.csv';out=Path(directory)/'out.csv'
            with inp.open('w',newline='') as f:
                writer=csv.DictWriter(f,fieldnames=list(row));writer.writeheader();writer.writerow(row)
            with patch.object(sys,'argv',['audit','--input',str(inp),'--output',str(out),'--reviewed-bounded-samples']),patch.object(decoder.shutil,'which',return_value='/usr/bin/ffmpeg'),patch.object(decoder,'safe_request',return_value={'status':'decoded','seconds':2,'note':'=malicious'}) as fetch:
                decoder.main()
            fetch.assert_called_once_with('decode',row['stream_url'],timeout=45)
            with out.open(newline='') as f: saved=next(csv.DictReader(f))
            self.assertEqual(saved['name'],"'=evil");self.assertEqual(saved["'=header"],"'-evil");self.assertEqual(saved['ffmpeg_note'],"'=malicious")
            self.assertEqual(saved['description'],"'\t@evil")

    def test_no_opt_in_preserves_existing_report_and_guide_path(self):
        with tempfile.TemporaryDirectory() as directory:
            out=Path(directory)/'audit.csv';out.write_text('existing evidence')
            with patch.object(sys,'argv',['audit','--output',str(out)]), patch.object(decoder,'safe_request',side_effect=AssertionError('must not fetch')), patch('sys.stderr',new=io.StringIO()):
                with self.assertRaises(SystemExit): decoder.main()
            self.assertEqual(out.read_text(),'existing evidence')
        guide=Path(__file__).resolve().parents[1]/'docs/RadioBee_Stream_Test_Guide.md'
        self.assertIn('radio-bee-data/docs/RadioBee_Stream_Test_Guide.md',guide.read_text())
        self.assertNotIn('docs/RADIO-STREAM-QUICK-TEST.md',guide.read_text())

    def test_probe_fails_closed_and_api_is_paginated(self):
        with patch.object(collector,'safe_request',side_effect=OSError):
            self.assertEqual(collector.probe({'stream_url':'https://radio.example/live'})[0],'network-error')
        with patch.object(collector,'safe_request',return_value=[]) as fetch:
            self.assertEqual(collector.fetch(['directory.example'],'/json/stations',{'limit':10000}),[])
            self.assertIn('limit=25',fetch.call_args.args[1])
        for module,name in [(collector,'is_public_https'),(decoder,'safe_https')]:
            self.assertFalse(getattr(module,name)('https://public.example/\nhttp://localhost/'))


class ReportPreservationTests(unittest.TestCase):
    def input_file(self, directory):
        path=Path(directory)/'input.csv'
        path.write_text('stream_url,name\nhttps://radio.example/live,Tamil FM\n')
        return path

    def run_cli(self, arguments, result=None):
        return_value=result or {'status':'decoded','seconds':2,'note':'bounded'}
        with patch.object(sys,'argv',['audit',*arguments]),patch.object(decoder.shutil,'which',return_value='/usr/bin/ffmpeg'),patch.object(decoder,'safe_request',return_value=return_value) as fetch:
            decoder.main()
        return fetch

    def test_distinct_default_preserves_historical_audit(self):
        with tempfile.TemporaryDirectory() as directory:
            inp=self.input_file(directory)
            previous=os.getcwd()
            try:
                os.chdir(directory)
                Path('reports').mkdir()
                historical=Path('reports/radio_browser_tamil_ffmpeg.csv')
                historical.write_bytes(b'historical 224-row evidence\r\n')
                self.run_cli(['--input',str(inp),'--reviewed-bounded-samples'])
                self.assertTrue(Path('reports/radio_browser_tamil_bounded.csv').exists())
                self.assertEqual(historical.read_bytes(),b'historical 224-row evidence\r\n')
            finally:
                os.chdir(previous)

    def test_existing_report_is_rejected_before_requests(self):
        with tempfile.TemporaryDirectory() as directory:
            inp=self.input_file(directory);out=Path(directory)/'saved.csv';out.write_bytes(b'saved\r\n')
            with patch.object(sys,'argv',['audit','--input',str(inp),'--output',str(out),'--reviewed-bounded-samples']),patch.object(decoder.shutil,'which',return_value='/usr/bin/ffmpeg'),patch.object(decoder,'safe_request',side_effect=AssertionError('must not fetch')),patch('sys.stderr',new=io.StringIO()):
                with self.assertRaises(SystemExit):decoder.main()
            self.assertEqual(out.read_bytes(),b'saved\r\n')

    def test_invalid_arguments_and_input_output_alias_do_not_erase(self):
        with tempfile.TemporaryDirectory() as directory:
            inp=self.input_file(directory);original=inp.read_bytes()
            for extra in [['--seconds','9'],[]]:
                with patch.object(sys,'argv',['audit','--input',str(inp),'--output',str(inp),'--overwrite','--reviewed-bounded-samples',*extra]),patch.object(decoder.shutil,'which',return_value='/usr/bin/ffmpeg'),patch.object(decoder,'safe_request',side_effect=AssertionError('must not fetch')),patch('sys.stderr',new=io.StringIO()):
                    with self.assertRaises(SystemExit):decoder.main()
                self.assertEqual(inp.read_bytes(),original)

    def test_failed_or_rejected_workflow_cannot_replace_saved_report(self):
        with tempfile.TemporaryDirectory() as directory:
            inp=self.input_file(directory);out=Path(directory)/'saved.csv';out.write_bytes(b'evidence')
            args=['--input',str(inp),'--output',str(out),'--overwrite','--reviewed-bounded-samples']
            for status in ['failed','not-tested','partial-error','safe-workflow-error','skipped-not-public-https']:
                with self.assertRaises(ValueError):self.run_cli(args,{'status':status,'seconds':0,'note':'rejected'})
                self.assertEqual(out.read_bytes(),b'evidence')
            with patch.object(decoder,'safe_request',side_effect=OSError('network rejected')),patch.object(sys,'argv',['audit',*args]),patch.object(decoder.shutil,'which',return_value='/usr/bin/ffmpeg'):
                with self.assertRaises(ValueError):decoder.main()
            self.assertEqual(out.read_bytes(),b'evidence')

    def test_explicit_overwrite_publishes_complete_file_atomically(self):
        with tempfile.TemporaryDirectory() as directory:
            inp=self.input_file(directory);out=Path(directory)/'saved.csv';out.write_text('old evidence')
            replace=decoder.os.replace
            def inspect_then_replace(source,destination):
                self.assertEqual(out.read_text(),'old evidence')
                self.assertEqual(Path(source).parent,out.parent)
                with Path(source).open(newline='') as f:rows=list(csv.DictReader(f))
                self.assertEqual(len(rows),1);self.assertEqual(rows[0]['ffmpeg_status'],'decoded')
                replace(source,destination)
            with patch.object(decoder.os,'replace',side_effect=inspect_then_replace) as publish:
                self.run_cli(['--input',str(inp),'--output',str(out),'--overwrite','--reviewed-bounded-samples'])
            publish.assert_called_once();self.assertEqual(list(Path(directory).glob('.*.tmp')),[])

    def test_write_and_replace_failures_preserve_old_bytes_and_clean_temp(self):
        with tempfile.TemporaryDirectory() as directory:
            out=Path(directory)/'saved.csv';out.write_bytes(b'old evidence')
            rows=[{'ffmpeg_status':'decoded'}]
            with self.assertRaises(ValueError):decoder.write_report(out,['ffmpeg_status'],[],overwrite=True)
            self.assertEqual(out.read_bytes(),b'old evidence')
            for operation in ['writerows','replace']:
                target=patch.object(decoder.csv.DictWriter,'writerows',side_effect=OSError('disk full')) if operation=='writerows' else patch.object(decoder.os,'replace',side_effect=OSError('replace failed'))
                with target:
                    with self.assertRaises(OSError):decoder.write_report(out,['ffmpeg_status'],rows,overwrite=True)
                self.assertEqual(out.read_bytes(),b'old evidence');self.assertEqual(list(Path(directory).glob('.*.tmp')),[])

    def test_late_destination_cannot_be_clobbered_without_overwrite(self):
        with tempfile.TemporaryDirectory() as directory:
            out=Path(directory)/'new.csv';link=decoder.os.link
            def create_racer(source,destination):
                Path(destination).write_bytes(b'concurrent saved evidence')
                link(source,destination)
            with patch.object(decoder.os,'link',side_effect=create_racer):
                with self.assertRaises(FileExistsError):decoder.write_report(out,['ffmpeg_status'],[{'ffmpeg_status':'decoded'}])
            self.assertEqual(out.read_bytes(),b'concurrent saved evidence');self.assertEqual(list(Path(directory).glob('.*.tmp')),[])


if __name__=='__main__':
    unittest.main()
