const path = require('path');
const {execFile} = require('child_process');
const pdftocairoBin = '/usr/bin/pdftocairo';
const FORMATS = ['png', 'jpeg', 'tiff', 'pdf', 'ps', 'eps', 'svg'];

let defaultOptions = {
    format: 'jpeg',
    scale: 1024,
    out_dir: null,
    out_prefix: null,
    page: 1
  };
  
  exports.pdf2Image =  function pdf2image(file, opts) {
      return new Promise((resolve, reject) => {
          opts.format = FORMATS.includes(opts.format) ? opts.format : defaultOptions.format;
          opts.scale = opts.scale || defaultOptions.scale;
          opts.out_dir = opts.out_dir || defaultOptions.out_dir;
          opts.out_prefix = opts.out_prefix || path.dirname(file);
          opts.out_prefix = opts.out_prefix || path.basename(file, path.extname(file));
          opts.page = opts.page || defaultOptions.page;
  
          let args = [];
          args.push([`-${opts.format}`]);
          if (opts.page) {
              args.push(['-f']);
              args.push([parseInt(opts.page)]);
              args.push(['-l']);
              args.push([parseInt(opts.page)]);
          }
          if (opts.scale) {
              args.push(['-scale-to']);
              args.push([parseInt(opts.scale)]);
          }
          args.push(`${file}`);
          args.push(`${path.join(opts.out_dir, opts.out_prefix)}`);
             console.log(opts.out_prefix)
          execFile(pdftocairoBin, args, {
              encoding: 'utf8',
              maxBuffer: 5000*1024,
              shell: false
          }, (err, stdout, stderr) => {
              if (err) {
                  reject(err);
              }
              else {
                  resolve(stdout);
                  console.log(stdout)
              }
          });
      });
  };