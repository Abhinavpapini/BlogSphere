"use client"

import { useState, useEffect, useContext } from "react"
import axios from "axios"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "@clerk/clerk-react"
import { userAuthorContextObj } from "../../contexts/UserAuthorContext"
import { BookOpen, Loader2, Trash2 } from "lucide-react"

function Articles() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const navigate = useNavigate()
  const { getToken } = useAuth()
  const { currentUser } = useContext(userAuthorContextObj)
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  // Get all articles
  async function getArticles(category = "") {
    setLoading(true)
    try {
      // Get jwt token
      const token = await getToken()
      // Make authenticated req
      const res = await axios.get(`${BACKEND_URL}/author-api/articles${category ? `/filter/${category}` : ""}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (res.data.message === "articles") {
        setArticles(res.data.payload)
        setError("")
      } else {
        setError(res.data.message)
      }
    } catch (err) {
      setError("Failed to load articles. Please try again later.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Go to specific article
  function gotoArticleById(articleObj) {
    navigate(`../${articleObj.articleId}`, { state: articleObj })
  }

  useEffect(() => {
    getArticles(selectedCategory)
  }, [selectedCategory])

  if (loading) {
    return (
      <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "300px" }}>
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
        <span className="ms-2">Loading articles...</span>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="my-4">Articles</h2>
        <div className="d-flex align-items-center">
          <select
            className="form-select me-3"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="programming">Programming</option>
            <option value="AI&ML">AI & Machine Learning</option>
            <option value="database">Database</option>
            <option value="web-development">Web Development</option>
            <option value="mobile-development">Mobile Development</option>
            <option value="devops">DevOps</option>
            <option value="cybersecurity">Cybersecurity</option>
          </select>
          {currentUser.role === "author" && (
            <Link to="../deleted-articles" className="deleted-btn">
              <Trash2 size={16} className="me-2" /> Deleted
            </Link>
          )}
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {articles.length === 0 && !error ? (
        <div className="text-center p-5 bg-light rounded">
          <p className="mb-3 fs-4">No articles found</p>
          {currentUser.role === "author" && (
            <Link to="../article" className="add-article-btn">
              Write your first article
            </Link>
          )}
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
          {articles.map((articleObj) => (
            <div className="col" key={articleObj.articleId}>
              <div className="card h-100 border-0 shadow-sm hover-card">
                <div className="card-body">
                  {/* Author image and name */}
                  <div className="author-details d-flex align-items-center mb-3">
                    <img
                      src={articleObj.authorData.profileImageUrl || "/placeholder.svg"}
                      width="40px"
                      height="40px"
                      className="rounded-circle border border-light me-2"
                      alt={articleObj.authorData.nameOfAuthor}
                    />
                    <div>
                      <small className="text-muted d-block" style={{ fontSize: '0.75rem' }}>author</small>
                      <p className="mb-0">{articleObj.authorData.nameOfAuthor}</p>
                    </div>
                  </div>

                  {/* Article title */}
                  <h5 className="card-title heading">{articleObj.title}</h5>

                  {/* Category badge */}
                  <span className="badge bg-light text-dark mb-2">{articleObj.category}</span>

                  {/* Article content preview */}
                  <p className="card-text text-muted">{articleObj.content.substring(0, 120) + "..."}</p>

                  {/* Read more button */}
                  <button className="custom-btn d-flex align-items-center" onClick={() => gotoArticleById(articleObj)}>
                    <BookOpen size={16} className="me-2" />
                    Read more
                  </button>
                </div>
                <div className="card-footer bg-transparent border-top-0">
                  <small className="text-muted">Last updated on {articleObj.dateOfModification}</small>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Articles

