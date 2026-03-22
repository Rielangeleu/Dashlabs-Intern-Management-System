//Code for uploading data in the endorsement database

import clientPromise from "@/app/lib/mongodb";


export async function POST(req: Request) {
  try {
    const body = await req.json()

    const client = await clientPromise
    const db = client.db("endorsement")

    const result = await db.collection("endorsements").insertOne({
      ...body,
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