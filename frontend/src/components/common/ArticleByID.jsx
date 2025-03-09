"use client"

import { useContext, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { userAuthorContextObj } from "../../contexts/UserAuthorContext"
import { Edit, Trash2, RotateCcw } from "lucide-react"
import { useForm } from "react-hook-form"
import axios from "axios"
import { useAuth } from "@clerk/clerk-react"

function ArticleByID() {
  const { state } = useLocation()
  const { currentUser } = useContext(userAuthorContextObj)
  const [editArticleStatus, setEditArticleStatus] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm()
  const navigate = useNavigate()
  const { getToken } = useAuth()
  const [currentArticle, setCurrentArticle] = useState(state)
  const [commentStatus, setCommentStatus] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  function enableEdit() {
    setEditArticleStatus(true)
  }

  async function onSave(modifiedArticle) {
    setIsSubmitting(true)
    try {
      const articleAfterChanges = { ...state, ...modifiedArticle }
      const token = await getToken()
      const currentDate = new Date()
      articleAfterChanges.dateOfModification =
        currentDate.getDate() +
        "-" +
        currentDate.getMonth() +
        "-" +
        currentDate.getFullYear() +
        " " +
        currentDate.toLocaleTimeString("en-US", { hour12: true })

      const res = await axios.put(
        `http://localhost:3000/author-api/article/${articleAfterChanges.articleId}`,
        articleAfterChanges,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      if (res.data.message === "article modified") {
        setEditArticleStatus(false)
        navigate(`/author-profile/articles/${state.articleId}`, { state: res.data.payload })
      }
    } catch (error) {
      console.error("Error saving article:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  async function addComment(commentObj) {
    setIsSubmitting(true)
    try {
      // Create a properly structured comment object
      const comment = {
        nameOfUser: currentUser.firstName,
        comment: commentObj.comment
      };
      
      const res = await axios.put(
        `http://localhost:3000/user-api/comment/${currentArticle.articleId}`, 
        comment
      );
      
      if (res.data.message === "comment added") {
        setCommentStatus("Comment added successfully")
        // Update the current article with the new comment from the response
        setCurrentArticle(res.data.payload)
        // Reset the form
        reset()
        // Clear the success message after 3 seconds
        setTimeout(() => {
          setCommentStatus("")
        }, 3000)
      }
    } catch (error) {
      setCommentStatus("Failed to add comment")
      console.error("Error adding comment:", error.response?.data || error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  async function deleteArticle() {
    try {
      const token = await getToken()
      const articleToUpdate = { ...state, isArticleActive: false }
      const res = await axios.put(
        `http://localhost:3000/author-api/articles/${state.articleId}`,
        articleToUpdate,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      if (res.data.message === "article deleted or restored") {
        setCurrentArticle(res.data.payload)
        navigate("../articles")
      }
    } catch (error) {
      console.error("Error deleting article:", error)
    }
  }

  async function restoreArticle() {
    try {
      const token = await getToken()
      const articleToUpdate = { ...state, isArticleActive: true }
      const res = await axios.put(
        `http://localhost:3000/author-api/articles/${state.articleId}`,
        articleToUpdate,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      if (res.data.message === "article deleted or restored") {
        setCurrentArticle(res.data.payload)
        navigate("../articles")
      }
    } catch (error) {
      console.error("Error restoring article:", error)
    }
  }

  return (
    <div className="container">
      {editArticleStatus === false ? (
        <>
          <div className="mb-5">
            <div className="author-block w-100 px-4 py-3 rounded-3 d-flex justify-content-between align-items-center">
              <div>
                <h1 className="display-4">{state.title}</h1>
                <div className="py-2">
                  <span className="badge bg-light text-dark me-2">{state.category}</span>
                  <small className="text-secondary me-4">Created: {state.dateOfCreation}</small>
                  <small className="text-secondary">Modified: {state.dateOfModification}</small>
                </div>
              </div>
              <div className="author-details text-center">
                <img
                  src={state.authorData.profileImageUrl || "/placeholder.svg"}
                  width="70px"
                  className="rounded-circle mb-2"
                  alt={state.authorData.nameOfAuthor}
                />
                <p className="mb-0 text-white">{state.authorData.nameOfAuthor}</p>
              </div>
            </div>

            {currentUser.role === "author" && (
              <div className="d-flex justify-content-end mt-3 mb-4">
                <button className="btn btn-outline-primary me-2" onClick={enableEdit}>
                  <Edit size={18} className="me-1" /> Edit
                </button>

                {state.isArticleActive ? (
                  <button className="btn btn-outline-danger" onClick={deleteArticle}>
                    <Trash2 size={18} className="me-1" /> Delete
                  </button>
                ) : (
                  <button className="btn btn-outline-success" onClick={restoreArticle}>
                    <RotateCcw size={18} className="me-1" /> Restore
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="article-content rounded-3 mb-5" style={{ whiteSpace: "pre-line" }}>
            {state.content}
          </div>

          <div className="comments-section bg-light p-4 rounded-3 mb-4">
            <h3 className="mb-4">Comments</h3>

            {currentArticle.comments.length === 0 ? (
              <p className="text-muted">No comments yet. Be the first to comment!</p>
            ) : (
              <div className="comments">
                {[...currentArticle.comments].reverse().map((commentObj, index) => (
                  <div key={index} className="comment-item mb-3 pb-3 border-bottom">
                    <p className="user-name mb-1">{commentObj.nameOfUser}</p>
                    <p className="comment mb-0">{commentObj.comment}</p>
                  </div>
                ))}
              </div>
            )}

            {currentUser.role === "user" && (
              <div className="mt-4">
                {commentStatus && (
                  <div className={`alert ${commentStatus.includes("success") ? "alert-success" : "alert-danger"} mb-3`}>
                    {commentStatus}
                  </div>
                )}

                <form onSubmit={handleSubmit(addComment)}>
                  <div className="mb-3">
                    <label htmlFor="comment" className="form-label">
                      Add a comment
                    </label>
                    <textarea
                      {...register("comment", { required: "Comment cannot be empty" })}
                      className="form-control"
                      id="comment"
                      rows="3"
                      placeholder="Share your thoughts..."
                    ></textarea>
                    {errors.comment && <div className="text-danger mt-1">{errors.comment.message}</div>}
                  </div>

                  <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                    {isSubmitting ? "Posting..." : "Post Comment"}
                  </button>
                </form>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="edit-article-form bg-light p-4 rounded-3">
          <h2 className="mb-4">Edit Article</h2>

          <form onSubmit={handleSubmit(onSave)}>
            <div className="mb-3">
              <label htmlFor="title" className="form-label">
                Title
              </label>
              <input
                type="text"
                className="form-control"
                id="title"
                defaultValue={state.title}
                {...register("title", { required: "Title is required" })}
              />
              {errors.title && <div className="text-danger mt-1">{errors.title.message}</div>}
            </div>

            <div className="mb-3">
              <label htmlFor="category" className="form-label">
                Category
              </label>
              <select
                {...register("category", { required: "Please select a category" })}
                id="category"
                className="form-select"
                defaultValue={state.category}
              >
                <option value="" disabled>
                  --Select Category--
                </option>
                <option value="programming">Programming</option>
                <option value="AI&ML">AI & Machine Learning</option>
                <option value="database">Database</option>
                <option value="web-development">Web Development</option>
                <option value="mobile-development">Mobile Development</option>
                <option value="devops">DevOps</option>
                <option value="cybersecurity">Cybersecurity</option>
              </select>
              {errors.category && <div className="text-danger mt-1">{errors.category.message}</div>}
            </div>

            <div className="mb-3">
              <label htmlFor="content" className="form-label">
                Content
              </label>
              <textarea
                {...register("content", { required: "Content is required" })}
                className="form-control"
                id="content"
                rows="15"
                defaultValue={state.content}
              ></textarea>
              {errors.content && <div className="text-danger mt-1">{errors.content.message}</div>}
            </div>

            <div className="d-flex justify-content-end gap-2">
              <button type="button" className="btn btn-secondary" onClick={() => setEditArticleStatus(false)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-success" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

export default ArticleByID

