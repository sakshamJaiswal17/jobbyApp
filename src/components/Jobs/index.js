import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsSearch} from 'react-icons/bs'
import JobCard from '../JobCard/index'

import Header from '../Header/index'

import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

class Jobs extends Component {
  state = {
    jobsList: [],
    search: '',
    jobsListStatus: 'INITIAL',
    employmentType: [],
    minPackage: '',
    profileStatus: 'INITIAL',
    profilDetail: {},
  }

  componentDidMount() {
    this.getProfileApi()
    this.getJobListApi()
  }

  getProfileApi = async () => {
    this.setState({profileStatus: 'INITIAL'})
    const url = 'https://apis.ccbp.in/profile'
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, options)
    if (response.ok === true) {
      const data = await response.json()
      const profileDetails = data.profile_details
      const formatData = {
        name: profileDetails.name,
        profileImageUrl: profileDetails.profile_image_url,
        shortBio: profileDetails.short_bio,
      }
      this.setState({
        profilDetail: formatData,
        profileStatus: 'SUCCESS',
      })
    } else {
      this.setState({profileStatus: 'FAILURE'})
    }
  }

  getJobListApi = async () => {
    this.setState({jobsListStatus: 'INITIAL'})
    const {search, employmentType, minPackage} = this.state
    const url = `https://apis.ccbp.in/jobs?employment_type=${employmentType}&minimum_package=${minPackage}&search=${search}`
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, options)
    if (response.ok === true) {
      const data = await response.json()
      const formatData = data.jobs.map(each => ({
        companyLogoUrl: each.company_logo_url,
        employmentType: each.employment_type,
        id: each.id,
        jobDescription: each.job_description,
        location: each.location,
        packagePerAnnum: each.package_per_annum,
        rating: each.rating,
        title: each.title,
      }))
      this.setState({
        jobsList: formatData,
        search: '',
        jobsListStatus: 'SUCCESS',
      })
    } else {
      this.setState({jobsListStatus: 'FAILURE', search: ''})
    }
  }

  onClickSearch = () => {
    this.getJobListApi()
  }

  onChangeSearch = event => {
    this.setState({search: event.target.value})
  }

  searchInputContainer = () => {
    const {search} = this.state
    return (
      <div className="search-conatiner">
        <input
          value={search}
          onChange={this.onChangeSearch}
          type="search"
          placeholder="search"
          className="search-input"
        />

        <BsSearch className="search-icon" onClick={this.onClickSearch} />
      </div>
    )
  }

  renderLoadingView = () => (
    <>
      <div className="loader-container" data-testid="loader">
        <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
      </div>
    </>
  )

  renderFailureView = () => (
    <>
      <div>
        <img
          src="https://assets.ccbp.in/frontend/react-js/failure-img.png "
          alt="failure view"
          className="failure-view"
        />
        <h1 className="failure-heading">Oops! Something Went Wrong</h1>
        <p className="failure-description">
          We cannot seem to find the page you are looking for
        </p>
        <button className="retry-btn" type="button">
          Retry
        </button>
      </div>
    </>
  )

  renderJobsDetailsView = () => {
    const {jobsList} = this.state
    if (jobsList.length < 1) {
      return (
        <div>
          <img
            src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
            alt="no jobs"
            className="no-jobs-img"
          />
          <h1>No Jobs Found</h1>
          <p>We could not find any jobs.Try other filter.</p>
        </div>
      )
    }
    return (
      <div className="jobs-and-search-conatiner">
        <ul>
          {jobsList.map(each => (
            <JobCard details={each} key={each.id} />
          ))}
        </ul>
      </div>
    )
  }

  renderProfileFailureView = () => (
    <div className="align-center">
      <button className="retry-btn" type="button">
        Retry
      </button>
    </div>
  )

  renderProfileView = () => {
    const {profilDetail} = this.state
    const {name, profileImageUrl, shortBio} = profilDetail
    return (
      <div className="profile-container">
        <img src={profileImageUrl} alt="profile" className="profile-img" />
        <h1 className="profile-name">{name}</h1>
        <p className="profile-bio">{shortBio}</p>
      </div>
    )
  }

  renderProfile = () => {
    const {profileStatus} = this.state
    switch (profileStatus) {
      case 'SUCCESS':
        return this.renderProfileView()
      case 'FAILURE':
        return this.renderProfileFailureView()
      case 'INITIAL':
        return this.renderLoadingView()
      default:
        return null
    }
  }

  onChangeCheckbox = event => {
    const {employmentType} = this.state
    const checkboxValue = event.target.value
    const typeGet = employmentType.filter(each => each === checkboxValue)
    if (typeGet.length === 0) {
      this.setState(
        prevState => ({
          employmentType: [...prevState.employmentType, checkboxValue],
        }),
        this.getJobListApi,
      )
    } else {
      const filterOnList = employmentType.filter(each => each !== checkboxValue)
      this.setState(
        {
          employmentType: filterOnList,
        },
        this.getJobListApi,
      )
    }
  }

  onChangeRadio = event => {
    this.setState({minPackage: event.target.value}, this.getJobListApi)
  }

  renderFilterColumn = () => (
    <div>
      {this.renderProfile()}
      <hr />
      <h1 className="filter-heading">Type of employment</h1>
      <ul>
        {employmentTypesList.map(each => (
          <li className="row-con" key={each.employmentTypeId}>
            <input
              value={each.employmentTypeId}
              onChange={this.onChangeCheckbox}
              type="checkbox"
              id={each.employmentTypeId}
            />
            <label className="label-checkbox" htmlFor={each.employmentTypeId}>
              {each.label}
            </label>
          </li>
        ))}
      </ul>

      <hr />
      <h1 className="filter-heading">salary Range</h1>
      <ul>
        {salaryRangesList.map(each => (
          <li className="row-con" key={each.salaryRangeId}>
            <input
              value={each.salaryRangeId}
              onChange={this.onChangeRadio}
              type="radio"
              name="salary"
              id={each.salaryRangeId}
            />
            <label className="label-checkbox" htmlFor={each.salaryRangeId}>
              {each.label}
            </label>
          </li>
        ))}
      </ul>
    </div>
  )

  renderJobsDetail = () => {
    const {jobsListStatus} = this.state
    switch (jobsListStatus) {
      case 'SUCCESS':
        return this.renderJobsDetailsView()
      case 'FAILURE':
        return this.renderFailureView()
      case 'INITIAL':
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="jobs-bg">
          <div className="filter-container">{this.renderFilterColumn()}</div>
          <div className="jobs-container">
            {this.searchInputContainer()}
            <div className="align-center">{this.renderJobsDetail()}</div>
          </div>
        </div>
      </>
    )
  }
}
export default Jobs
