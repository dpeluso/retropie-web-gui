import fileUpload from 'express-fileupload';
import cors from 'cors';
import fs from 'fs';
import _ from 'lodash';

export default function buildWorker(app, env) {

  const retroPieConfig = require(`./config/retropie${env}.json`);
  const systems = require(`./config/systems.json`);

  // Add headers
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

    next();
  });

  app.get('/api', (req, res) => {
    throw new Error('invalid access');
  });

  app.get('/api/check', (req, res) => {
    const check = {};
    let count = Object.keys(systems).length;
    systems.map((system) => {
      --count;
      const path = `${retroPieConfig.path}/${system.path}/`;
      try {
        fs.accessSync(path, fs.F_OK);
        check[system.name] = true;
      } catch (e) {
        check[system.name] = false;
      }

      if (count == 0) {
        res.send(check);
      }
    });
  });

  app.use(fileUpload());

  app.post('/api/upload', cors(), (req, res, next) => {
    if (!req.files) {
      res.send({ result: false, error: 'No files were uploaded.' });
      return;
    }

    const system = JSON.parse(req.body.system);
    const files = req.files;

    let remaining = Object.keys(files).length;
    _.forEach(files, (file) => {
      file.mv(`${retroPieConfig.path}/${system.path}/${file.name}`, (err) => {
        --remaining;
        if (remaining === 0 || err) {
          const result = {
            result: err === null,
            error: err ? err.message : null,
          };

          if (err) {
            res.status(500);
          }

          res.send(result);
        }
      });
    });
  });

  app.get('/api/list/:system', (req, res) => {
    const { system } = req.params;
    const index = _.findIndex(systems, (plt) => {
      return plt.name == system;
    });
    if (index == -1) {
      res.status(404).send({ error: 'wrong system name' });
      return;
    }

    const systemConfig = systems[index];

    try {
      const fileList = fs.readdirSync(`${retroPieConfig.path}/${systemConfig.path}/`)

      res.send({
        system,
        list: fileList,
      });
    } catch (e) {
      res.status(404)
         .send({
           system,
           error: e.message
         })
    }
  });
}
