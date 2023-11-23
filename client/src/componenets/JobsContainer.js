import { useEffect } from "react"
import { useAppContext } from "../context/AppContext"
import Loading from "./Loading"
import Wrapper from "../assets/wrappers/JobsContainer"
import Job from "./Job"
import Alert from "./Alert"
import PageBtnContainer from "./PageBtnContainer"

const JobsContainer = () => {
  const {
    getJobs,
    isLoading,
    showAlert,
    jobs,
    page,
    totalJobs,
    search,
    searchStatus,
    searchType,
    sort,
    numOfPages,
  } = useAppContext()

  useEffect(() => {
    getJobs()
    // eslint-disable-next-line
  }, [page, search, searchStatus, searchType, sort])

  if (isLoading) {
    return <Loading center />
  }

  if (jobs.length === 0) {
    return (
      <Wrapper>
        <h2>No Jobs To display....</h2>
      </Wrapper>
    )
  }

  return (
    <Wrapper>
      {showAlert && <Alert />}
      <h5>
        {totalJobs} job{jobs.length > 1 && "s"} available
      </h5>
      <div className="jobs">
        {jobs.map((job) => {
          return <Job key={job._id} {...job} />
        })}
      </div>
      {numOfPages > 1 && <PageBtnContainer />}
    </Wrapper>
  )
}

export default JobsContainer
