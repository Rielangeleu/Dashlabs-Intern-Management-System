
import clientPromise from "@/app/lib/mongodb"

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db("test")

    // Insert sample data
    const result = await db.collection("demo").insertOne({
      message: "Hello Guys this is our database for our project! 🚀",
      createdAt: new Date()
    })

    return Response.json({
      success: true,
      insertedId: result.insertedId
    })
  } catch (error) {
    console.error(error)
    return Response.json({ success: false, error })
  }
}