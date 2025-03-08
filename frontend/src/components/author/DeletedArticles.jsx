"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "@clerk/clerk-react"
import { RotateCcw, ArrowLeft, Loader2 } from "lucide-react"

function DeletedArticles() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const navigate = useNavigate()
  const { getToken } = useAuth()

  async function getDeletedArticles() {
    setLoading(true)
    try {
      const token = await getToken()
      const res = await axios.get("http://localhost:3000/author-api/deleted-articles", {
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
      setError("Failed to load deleted articles. Please try again later.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function restoreArticle(articleId) {
    try {
      const token = await getToken()
      // Find the article in our current state
      const articleToRestore = articles.find(article => article.articleId === articleId)
      if (!articleToRestore) {
        setError("Article not found")
        return
      }
      
      // Update it with isArticleActive set to true
      const articleToUpdate = { ...articleToRestore, isArticleActive: true }
      const res = await axios.put(
        `http://localhost:3000/author-api/articles/${articleId}`,
        articleToUpdate,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      
      if (res.data.message === "article deleted or restored") {
        setArticles(articles.filter((article) => article.articleId !== articleId))
        setError("")
      } else {
        setError(res.data.message)
      }
    } catch (error) {
      setError("Failed to restore article")
      console.error(error)
    }
  }

  useEffect(() => {
    getDeletedArticles()
  }, [])

  if (loading) {
    return (
      <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "300px" }}>
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
        <span className="ms-2">Loading deleted articles...</span>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="my-4">Deleted Articles</h2>
        <Link to="../articles" className="btn btn-outline-primary">
          <ArrowLeft size={16} className="me-2" /> Back to Articles
        </Link>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {articles.length === 0 && !error ? (
        <div className="text-center p-5 bg-light rounded">
          <p className="mb-0 fs-4">No deleted articles found</p>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
          {articles.map((articleObj) => (
            <div className="col" key={articleObj.articleId}>
              <div className="card h-100 border-0 shadow-sm bg-light">
                <div className="card-body">
                  <div className="position-absolute top-0 end-0 p-2">
                    <span className="badge bg-danger">Deleted</span>
                  </div>

                  <h5 className="card-title">{articleObj.title}</h5>
                  <p className="card-text text-muted">{articleObj.content.substring(0, 120) + "..."}</p>

                  <button
                    className="btn btn-outline-success d-flex align-items-center"
                    onClick={() => restoreArticle(articleObj.articleId)}
                  >
                    <RotateCcw size={16} className="me-2" />
                    Restore Article
                  </button>
                </div>
                <div className="card-footer bg-transparent">
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

export default DeletedArticles

