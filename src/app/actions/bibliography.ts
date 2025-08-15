"use client";

export async function fetchBibliography() {
    const res = await fetch("/api/bibliography", { method: "GET" });
    if (!res.ok) throw new Error("Error fetching bibliography");
    return res.json();
}

export async function addDocument(markdown: File, title: string, author: string, description: string) {
    const formData = new FormData();
    formData.append("file", markdown);
    formData.append("title", title);
    formData.append("author", author);
    formData.append("description", description);

    const res = await fetch("/api/bibliography", {
        method: "POST",
        body: formData,
    });
    if (!res.ok) throw new Error("Error adding document");
    return res.json();
}

export async function removeDocument(id: string) {
    const res = await fetch("/api/bibliography", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
    });
    if (!res.ok) throw new Error("Error deleting document");
    return res.json();
}