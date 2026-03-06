import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const users = await prisma.user.findMany();

  return NextResponse.json(users);
}

export async function POST(req: Request) {
  const body = await req.json();

  const user = await prisma.user.create({
    data: {
      name: body.name,

      email: body.email,
    },
  });

  return NextResponse.json(user);
}

export async function PUT(req: Request) {
  const body = await req.json();

  const user = await prisma.user.update({
    where: { id: body.id },

    data: {
      name: body.name,

      email: body.email,
    },
  });

  return NextResponse.json(user);
}

export async function DELETE(req: Request) {
  const body = await req.json();

  await prisma.user.delete({
    where: { id: body.id },
  });

  return NextResponse.json({ success: true });
}
