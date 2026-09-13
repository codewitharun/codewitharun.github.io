import ImageKit from "@imagekit/nodejs";

// Server-only proxy for image uploads. The admin editor (a Client
// Component) can't safely hold an ImageKit private key, so it posts the
// file here as multipart/form-data; this route is the only place that
// ever touches IMAGEKIT_PRIVATE_KEY, which never reaches the browser.
//
// Replaces the old Firebase Storage upload path (uploadBytes +
// getDownloadURL) after the Firebase Storage account got blocked —
// everything downstream (the returned URL gets saved as a plain string on
// the Firestore post/project document) is unchanged.

export async function POST(request: Request) {
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
  if (!privateKey) {
    return Response.json(
      { error: "IMAGEKIT_PRIVATE_KEY is not set on the server." },
      { status: 500 },
    );
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const fileName = formData.get("fileName");
  const folder = formData.get("folder");

  if (!(file instanceof File) || typeof fileName !== "string") {
    return Response.json(
      { error: "Missing file or fileName." },
      { status: 400 },
    );
  }

  try {
    const imagekit = new ImageKit({ privateKey });
    const result = await imagekit.files.upload({
      file,
      fileName,
      folder: typeof folder === "string" ? folder : undefined,
      useUniqueFileName: false,
    });

    if (!result.url) {
      return Response.json(
        { error: "ImageKit upload returned no URL." },
        { status: 502 },
      );
    }

    return Response.json({ url: result.url, fileId: result.fileId ?? null });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload failed.";
    return Response.json({ error: message }, { status: 502 });
  }
}
