const API = "/blogs"; 
const $ = (id) => document.getElementById(id);

$("blogForm").onsubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            title: $("title").value,
            body: $("body").value,
            author: $("author").value || "Anonymous"
        }),
    });
    if (res.ok) {
        alert("Blog Added Successfully!");
        loadPosts();
    } else {
        alert("Error adding blog.");
    }
    e.target.reset();
};

const loadPosts = async () => {
    const res = await fetch(API);
    const posts = await res.json();
    $("posts").innerHTML = posts.map(p => `
        <div class="post" id="post-${p._id}">
            <h3>${p.title}</h3>
            <p>${p.body}</p>
            <small>Author: ${p.author}</small>
            <button onclick="deletePost('${p._id}')">Delete</button>
            <button onclick="showEditForm('${p._id}')">Edit</button>
            <div class="edit-form" id="edit-form-${p._id}" style="display:none;">
                <input type="text" id="edit-title-${p._id}" value="${p.title}">
                <textarea id="edit-body-${p._id}">${p.body}</textarea>
                <input type="text" id="edit-author-${p._id}" value="${p.author}">
                <button onclick="editPost('${p._id}')">Save</button>
            </div>
        </div>
    `).join("");
};

const deletePost = async (id) => {
    const res = await fetch(`${API}/${id}`, { method: "DELETE" });
    if (res.ok) {
        alert("Blog Deleted!");
        loadPosts();
    } else {
        alert("Error deleting blog.");
    }
};

const showEditForm = (id) => {
    document.getElementById(`edit-form-${id}`).style.display = "block";
};

const editPost = async (id) => {
    const newTitle = document.getElementById(`edit-title-${id}`).value;
    const newBody = document.getElementById(`edit-body-${id}`).value;
    const newAuthor = document.getElementById(`edit-author-${id}`).value;

    const res = await fetch(`${API}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            title: newTitle,
            body: newBody,
            author: newAuthor || "Anonymous"
        }),
    });

    if (res.ok) {
        alert("Blog Updated!");
        loadPosts();
    } else {
        alert("Error updating blog.");
    }
};

const searchById = async () => {
    const id = $("searchId").value.trim();
    if (!id) return alert("Enter a blog ID!");

    const res = await fetch(`${API}/${id}`);
    const post = await res.json();

    if (post.error) {
        $("posts").innerHTML = "<p>Blog not found</p>";
    } else {
        $("posts").innerHTML = `
            <div class="post">
                <h3>${post.title}</h3>
                <p>${post.body}</p>
                <small>Author: ${post.author}</small>
                <button onclick="deletePost('${post._id}')">Delete</button>
                <button onclick="showEditForm('${post._id}')">Edit</button>
            </div>
        `;
    }
};

loadPosts();
