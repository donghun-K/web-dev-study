import { MongoClient } from 'mongodb';

async function handler(req, res) {
  const eventId = req.query.eventId;

  const client = await MongoClient.connect(
    'mongodb+srv://donghun:gFCZS27xZrseet1D@cluster0.cctfa7o.mongodb.net/?retryWrites=true&w=majority'
  );

  const db = client.db('events');

  if (req.method === 'POST') {
    const { email, name, text } = req.body;

    if (
      !email.includes('@') ||
      !name ||
      name.trim() === '' ||
      !text ||
      text.trim() === ''
    ) {
      res.status(422).json({ message: 'Invalid input.' });
      return;
    }

    const newComment = {
      email,
      name,
      text,
      eventId,
    };

    const result = await db.collection('comments').insertOne(newComment);

    console.log(result);

    newComment.id = result.insertedId;

    res.status(201).json({ message: 'Added comment.', comment: newComment });
  }

  if (req.method === 'GET') {
    const dummyList = [
      { id: 'c1', name: 'DongHun', text: 'A first comment!' },
      { id: 'c2', name: 'JooHyeon', text: 'A Second comment!' },
    ];

    res.status(200).json({ comments: dummyList });
  }

  client.close();
}

export default handler;
