"use client"

import { useContext, useState } from "react"
import { useForm } from "react-hook-form"
import axios from "axios"
import { userAuthorContextObj } from "../../contexts/UserAuthorContext"
import { useNavigate } from "react-router-dom"

function PostArticle() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm()
  const { currentUser } = useContext(userAuthorContextObj)
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  async function postArticle(articleObj) {
    setIsSubmitting(true)
    setError("")

    try {
      // Create article object as per article schema
      const authorData = {
        nameOfAuthor: currentUser.firstName,
        email: currentUser.email,
        profileImageUrl: currentUser.profileImageUrl,
      }

      // Add author data
      articleObj.authorData = authorData

      // Generate article ID (timestamp)
      articleObj.articleId = Date.now()

      // Add date of creation & date of modification
      const currentDate = new Date()
      const formattedDate =
        currentDate.getDate() +
        "-" +
        currentDate.getMonth() +
        "-" +
        currentDate.getFullYear() +
        " " +
        currentDate.toLocaleTimeString("en-US", { hour12: true })

      articleObj.dateOfCreation = formattedDate
      articleObj.dateOfModification = formattedDate

      // Add comments array
      articleObj.comments = []

      // Add article active state
      articleObj.isArticleActive = true

      // Make HTTP POST req to create new article in backend
      const res = await axios.post(`${BACKEND_URL}/author-api/article`, articleObj)

      if (res.status === 201) {
        // Navigate to articles component
        navigate(`/author-profile/${currentUser.email}/articles`)
      } else {
        setError("Failed to create article. Please try again.")
      }
    } catch (err) {
      setError("An error occurred while creating the article.")
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container">
      <div className="row justify-content-center mt-4">
        <div className="col-lg-8 col-md-10">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-gradient text-center py-3 border-bottom">
              <h2 className="m-0" style={{ color: "var(--royal-blue)" }}>
                Write an Article
              </h2>
            </div>
            <div className="card-body p-4">
              {error && <div className="alert alert-danger">{error}</div>}

              <form onSubmit={handleSubmit(postArticle)}>
                <div className="mb-4">
                  <label htmlFor="title" className="form-label fw-bold">
                    Title
                  </label>
                  <input
                    type="text"
                    className={`form-control ${errors.title ? "is-invalid" : ""}`}
                    id="title"
                    placeholder="Enter a compelling title"
                    {...register("title", {
                      required: "Title is required",
                      minLength: {
                        value: 5,
                        message: "Title must be at least 5 characters long",
                      },
                    })}
                  />
                  {errors.title && <div className="invalid-feedback">{errors.title.message}</div>}
                </div>

                <div className="mb-4">
                  <label htmlFor="category" className="form-label fw-bold">
                    Category
                  </label>
                  <select
                    {...register("category", { required: "Please select a category" })}
                    id="category"
                    className={`form-select ${errors.category ? "is-invalid" : ""}`}
                    defaultValue=""
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
                  {errors.category && <div className="invalid-feedback">{errors.category.message}</div>}
                </div>

                <div className="mb-4">
                  <label htmlFor="content" className="form-label fw-bold">
                    Content
                  </label>
                  <textarea
                    {...register("content", {
                      required: "Content is required",
                      minLength: {
                        value: 50,
                        message: "Content must be at least 50 characters long",
                      },
                    })}
                    className={`form-control ${errors.content ? "is-invalid" : ""}`}
                    id="content"
                    rows="15"
                    placeholder="Write your article here..."
                  ></textarea>
                  {errors.content && <div className="invalid-feedback">{errors.content.message}</div>}
                </div>

                <div className="d-flex justify-content-end gap-2">
                  <button type="button" className="btn btn-secondary" onClick={() => reset()}>
                    Clear
                  </button>
                  <button type="submit" className="add-article-btn" disabled={isSubmitting}>
                    {isSubmitting ? "Publishing..." : "Publish Article"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostArticle

