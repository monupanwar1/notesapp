import express from 'express';
import cors from 'cors';
import authRouter from "./routes/user"

const app = express();

app.use(cors());
app.use(express.json());

// ✅ Correct use of router
app.use('/api/v1', authRouter);


app.listen(3000,()=>{
  console.log(`server is runnig on port3000`)
})

export default app;
