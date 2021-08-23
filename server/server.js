const http = require('http');
const mongoose = require('mongoose');
const url = require('url');
const qs = require('querystring');
const Todo = require('./models/todoModel');

const hostname = '127.0.0.1';
const port = 3001;
const DB = 'mongodb://localhost:27017/todo-app';
mongoose.connect(DB, {
  useNewUrlParse: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
})
.then(() => console.log(`Db connection Successfull`))
.catch((e) => console.log(e));

const server = http.createServer((req, res) => {

  if (req.method === 'GET') {
    return handleGETReq(req, res);
  } else if (req.method ==='POST'){
    return handlePOSTReq(req, res);
  }
  else if (req.method ==='PUT'){
    return handlePUTReq(req, res);
  }
  else if (req.method ==='DELETE'){
    return handleDELETEReq(req, res);
  }
  else if (req.url === '/') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify([{
      id: 1,
      text: "Shop Apple",
      is_done: false
    }, {    id: 2,
      text: "Clean Apple",
      is_done: false}, {    id:3,
        text: "Cut  Apple",
        is_done: false
      }
      ]));
  }
  res.end(`{"error": "${http.STATUS_CODES[404]}"}`)
});

const handleGETReq = async (req, res) => {
  const { pathname } = url.parse(req.url);
  if ( pathname != '/todo') {
    return handleError(res, 404);
  }

  res.setHeader('Content-Type', 'application/json;charset=utf-8');
  let todos = [];
  try {
     todos = await Todo.find({});
    console.log(todos);
  } catch(e) {
    console.log(e);
  }
  return res.end(JSON.stringify(todos));
}

const handlePOSTReq = (req, res) => {
  const size = parseInt(req.headers['content-length'], 10);
  const buffer = Buffer.allocUnsafe(size);

  let pos = 0;

  const { pathname } = url.parse(req.url);

  if (pathname !== '/todo') {
    return handleError(res, 404);
  }

  req
    .on('data', (chunk) => {
      const offset = chunk.length + pos;
      if(offset > size) {
        reject(413, 'Too large', res);
        return;
      }
      chunk.copy(buffer, pos);
      pos = offset;
    })
    .on('end', async () => {
      if (pos !== size) {
        reject(400, 'Bad request', res);
        return
      }
      const data = JSON.parse(buffer.toString());
      let data1 ;
      try {
       data1= await Todo.create(data);
      } catch (e) {
        console.log(e);
      }

      // save here for
      console.log('Todo posted: ', data1);
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.end(JSON.stringify(data));
    });
}

const handlePUTReq = (req, res) => {
  const { pathname, query } = url.parse(req.url);
  console.log(pathname);
  if (pathname != '/todo') {
    return handleError(res, 404);
  }

  const { id } = qs.parse(query);
  const size = parseInt(req.headers['content-length'], 10);
  const buffer = Buffer.allocUnsafe(size);

  let pos =0;
  req.on('data', (chunk) => {
    const offset= chunk.length + pos;
    if (offset > size) {
      reject(413, 'Too Large', res);
    }
    chunk.copy(buffer, pos);
    pos = offset;
  })
  .on('end', async () =>{
    if (pos != size) {
      reject(400, 'Bad Request', res);
      return;
    }

    const data = JSON.parse(buffer.toString());
    let doc = [];
    try {
      doc  = await Todo.updateOne({_id: id}, data);
      console.log(doc);
    } catch (e) {
      console.log(e);
    }
    // code to update here
    res.setHeader('Content-Type', 'application/json;charset=utf-8');
    res.end(`{"userUpdated": ${data}}`)
  })

};

const handleDELETEReq = async (req, res) => {
  const { pathname, query} = url.parse(req.url);
  if (pathname !== '/todo') {
    return handleError(res, 404);
  }

  const { id } = qs.parse(query);
  try {
    const doc = await Todo.deleteOne( {_id: id});
  } catch (e) {
    console.log(e);
  }
  // Model query here.
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify({userDeleted: "deleted"}));
}

const handleError = (res, code) => {
  res.statusCode = code;
  res.end(JSON.stringify({error: http.STATUS_CODES[code]}));
}
server.listen(port, hostname, () => {
  console.log(`Server is running on http://${hostname}:${port}`);
});

process.on('unhandledRejectionPromise', err => {
  console.log('Unhandled rejection! Shutting down');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  })
});


