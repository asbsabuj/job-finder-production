import { useState } from "react"
import { useAppContext } from "../../context/AppContext"
import { FormRow, Alert } from "../../componenets"
import Wrapper from "../../assets/wrappers/DashboardFormPage"

const Profile = () => {
  const { user, isLoading, showAlert, displayAlert, updateUser } =
    useAppContext()

  const [name, setName] = useState(user?.name)
  const [email, setEmail] = useState(user?.email)
  const [lastName, setLastName] = useState(user?.lastName)
  const [location, setLocation] = useState(user?.location)

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!name || !email || !lastName || !location) {
      displayAlert()
      return
    }
    updateUser({ name, email, lastName, location })
  }

  return (
    <Wrapper>
      <form className="form" onSubmit={handleSubmit}>
        <h3>Profile</h3>
        {showAlert && <Alert />}
        <div className="form-center">
          <FormRow
            type="text"
            name="name"
            value={name}
            handleChange={(e) => setName(e.target.value)}
          />
          <FormRow
            type="text"
            labelText="last name"
            name="lastName"
            value={lastName}
            handleChange={(e) => setLastName(e.target.value)}
          />
          <FormRow
            type="email"
            name="email"
            value={email}
            handleChange={(e) => setEmail(e.target.value)}
          />
          <FormRow
            type="text"
            name="location"
            value={location}
            handleChange={(e) => setLocation(e.target.value)}
          />

          <button className="btn btn-block" type="submit" disabled={isLoading}>
            {" "}
            {isLoading ? "please wait..." : "save changes"}
          </button>
        </div>
      </form>
    </Wrapper>
  )
}

export default Profile
