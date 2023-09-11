const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { usersRouter } = require('./Routes/userRouter');
const { postRouter } = require('./Routes/postsRouter');
const { commentsRouter } = require('./Routes/commentsRouter');
const { followRouter } = require('./Routes/followRouter');
const { resetPwd } = require('./Routes/resetPasswordRouter');
const { likeRouter } = require('./Routes/likesRouter');
const app = express();

app.use(express.json())
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/user', usersRouter);
app.use('/posts', postRouter );
app.use('/comments', commentsRouter);
app.use('/follow', followRouter)
app.use('/like', likeRouter)
app.use('/reset', resetPwd)

app.use((err, req, res, next) => {
  // Handle parsing errors or other middleware errors here
  res.status(500).json({ error: err.message });
});

app.listen(5000, () => {
  console.log('Listening on port 5000');
});
