import {Link} from 'react-router-dom'
import Header from '../Header/index'
import './index.css'

const Home = () => (
  <>
    <Header />
    <div className="home-bg-container">
      <h1 className="home-heading">Find The Job That Fits Your Life</h1>
      <p className="home-descripton">
        Millions of people are searching for jobs , salary information , <br />{' '}
        company reviews.Find the job that fit your abilities and potential.
      </p>
      <Link to="/jobs">
        <button type="button" className="find-jobs-btn">
          Find Jobs
        </button>
      </Link>
    </div>
  </>
)
export default Home
