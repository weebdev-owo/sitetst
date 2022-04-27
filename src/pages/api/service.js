export default function handler(req, res) {
  if (req.method === 'GET') {
    res.status(200).json({ name: 'omnom' })
  } else {
    res.status(400).json({ message: 'error must send get request' })
  }
}