import {extend} from '../libraries.js';
import { add_viewer_link, add_counts } from './decorators.js';
const instrument = {};
export default instrument;

// define the loader and categorizers for ncnr.sans instrument
function load_sans(load_params, db, noblock, return_type) {
  // load params is a list of: 
  // {datasource: "ncnr", path: "ncnrdata/cgd/...", mtime: 12319123109}
  var noblock = (noblock == true); // defaults to false if not specified
  var return_type = return_type || 'metadata';
  var calc_params = load_params.map(function(lp) {
    return {
      template: {
        "name": "loader_template",
        "description": "SANS remote loader",
        "modules": [
          {"module": "ncnr.sans.LoadRawSANS", "version": "0.1", "config": {}}
        ],
        "wires": [],
        "instrument": "ncnr.sans",
        "version": "0.0"
      },
      config: {"0": {"filelist": [{"path": lp.path, "source": lp.source, "mtime": lp.mtime}]}},
      node: 0,
      terminal:  "output",
      return_type: return_type
    }
  });
  return calc_params;
}

var NEXUZ_REGEXP = /\.nxz\.[^\.\/]+$/
var NEXUS_REGEXP = /\.nxs\.[^\.\/]+(\.zip)?$/
var DIV_REGEXP = /\.DIV$/

instrument.files_filter = function(x) {
  return (
    ((NEXUS_REGEXP.test(x) || DIV_REGEXP.test(x)) &&
        (/^(fp_)/.test(x) == false) &&
        (/^rapidscan/.test(x) == false) &&
        (/^scripted_findpeak/.test(x) == false))
  )
}

instrument.load_file = load_sans;
instrument.default_categories = [
  [["analysis.filepurpose"]],
  [["sample.description"]],
  [["analysis.intent"]],
  [["run.experimentScanID"]]
];
instrument.categories = extend(true, [], instrument.default_categories);
instrument.decorators = [add_viewer_link, add_counts];
