import './index.css'
import {FaStar} from 'react-icons/fa'
import {IoLocationOutline} from 'react-icons/io5'
import {BsBriefcaseFill} from 'react-icons/bs'
import {Link} from 'react-router-dom'

const JobCard = props => {
  const {details} = props
  const {
    companyLogoUrl,
    employmentType,
    id,
    jobDescription,
    location,
    packagePerAnnum,
    rating,
    title,
  } = details
  return (
    <Link className="Link" to={`/jobs/${id}`}>
      <li className="job-card-bg">
        <div className="row-con1">
          <img
            src={companyLogoUrl}
            alt="company logo"
            className="company-logo"
          />
          <div>
            <h1 className="card-title">{title}</h1>
            <p>
              <FaStar className="star-logo" />
              {rating}
            </p>
          </div>
        </div>
        <div className="row-con-space">
          <div className="job-location">
            <p className="location">
              <IoLocationOutline /> {location}
            </p>
            <p>
              <BsBriefcaseFill /> {employmentType}
            </p>
          </div>
          <p>{packagePerAnnum}</p>
        </div>
        <hr />
        <h1 className="des-heading">Description</h1>
        <p className="des">{jobDescription}</p>
      </li>
    </Link>
  )
}
export default JobCard
