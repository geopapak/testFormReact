import { useState } from 'react'
import './CaseForm.css'

const INFRACTION_TYPES = [
  { value: '', label: 'Select infraction type' },
  { value: 'traffic_fine', label: 'Traffic fine' },
  { value: 'toll_violation', label: 'Toll violation' },
  { value: 'other', label: 'Other vehicle-related charge' },
]

const OWNERSHIP_STATUSES = [
  { value: 'sold_before', label: 'I sold the vehicle before the infraction' },
  { value: 'purchased_after', label: 'I purchased the vehicle after the infraction' },
  { value: 'never_owned', label: 'I never owned the vehicle' },
  { value: 'transferred_not_registered', label: 'The vehicle was transferred but not yet registered' },
  { value: 'other', label: 'Other' },
]

const DOCUMENT_TYPES = [
  { value: '', label: 'Select document type' },
  { value: 'sale_contract', label: 'Vehicle Sale Contract' },
  { value: 'ownership_certificate', label: 'Vehicle Ownership Certificate' },
  { value: 'id_document', label: 'ID Document' },
  { value: 'other', label: 'Other Supporting Document' },
]

const initialFormData = {
  // Section 1 – Case Identification
  trafficFineNumber: '',
  infractionDate: '',
  infractionType: '',
  // Section 2 – Applicant Information
  firstName: '',
  lastName: '',
  dateOfBirth: '',
  address: '',
  // Section 3 – Vehicle Information
  licensePlateNumber: '',
  vin: '',
  vehicleBrand: '',
  // Section 4 – Ownership Status Declaration
  ownershipStatus: '',
  // Section 5 – Ownership Timeline
  dateSold: '',
  datePurchased: '',
  transferRegistrationDate: '',
  // Section 6 – Supporting Documents
  documentType: '',
  uploadedFile: null,
  // Section 7 – Declaration
  declarationAccepted: false,
}

const API_URL = 'http://localhost:8080/cases'

export default function CaseForm() {
  const [formData, setFormData] = useState(initialFormData)
  const [submitting, setSubmitting] = useState(false)
  const [submitResult, setSubmitResult] = useState(null) // { success, message }

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target
    if (type === 'checkbox') {
      setFormData((prev) => ({ ...prev, [name]: checked }))
    } else if (type === 'file') {
      setFormData((prev) => ({ ...prev, [name]: files[0] ?? null }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setSubmitResult(null)

    const payload = new FormData()
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        payload.append(key, value)
      }
    })

    try {
      const res = await fetch(API_URL, { method: 'POST', body: payload })
      const text = await res.text()
      if (res.ok) {
        setSubmitResult({ success: true, message: 'Case submitted successfully!' })
        setFormData(initialFormData)
      } else {
        setSubmitResult({ success: false, message: text || 'Submission failed.' })
      }
    } catch {
      setSubmitResult({ success: false, message: 'Network error – could not reach the server.' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="form-wrapper">
      <form className="case-form" onSubmit={handleSubmit} noValidate>

        {/* ── Logo ── */}
        <div className="form-logo">
          <img
            src="https://nivi.it/wp-content/uploads/2025/12/LOGO-NEW.png"
            alt="Logo"
          />
        </div>

        {/* ── Section 1: Case Identification ── */}
        <div className="form-section">
          <h2 className="section-title">Case Identification</h2>

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="trafficFineNumber">Traffic Fine Number</label>
              <input
                id="trafficFineNumber"
                name="trafficFineNumber"
                type="text"
                placeholder="Enter traffic fine number"
                value={formData.trafficFineNumber}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="infractionDate">Infraction Date</label>
              <input
                id="infractionDate"
                name="infractionDate"
                type="date"
                value={formData.infractionDate}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="infractionType">Infraction Type</label>
              <select
                id="infractionType"
                name="infractionType"
                value={formData.infractionType}
                onChange={handleChange}
              >
                {INFRACTION_TYPES.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* ── Section 2: Applicant Information ── */}
        <div className="form-section">
          <h2 className="section-title">Applicant Information</h2>

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                placeholder="Enter first name"
                value={formData.firstName}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                placeholder="Enter last name"
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="dateOfBirth">Date of Birth</label>
              <input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={handleChange}
              />
            </div>

            <div className="form-group form-group--full">
              <label htmlFor="address">Address</label>
              <input
                id="address"
                name="address"
                type="text"
                placeholder="Enter full address"
                value={formData.address}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* ── Section 3: Vehicle Information ── */}
        <div className="form-section">
          <h2 className="section-title">Vehicle Information</h2>

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="licensePlateNumber">License Plate Number</label>
              <input
                id="licensePlateNumber"
                name="licensePlateNumber"
                type="text"
                placeholder="Enter license plate"
                value={formData.licensePlateNumber}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="vin">Vehicle Identification Number (VIN)</label>
              <input
                id="vin"
                name="vin"
                type="text"
                placeholder="Enter VIN"
                value={formData.vin}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="vehicleBrand">Vehicle Brand</label>
              <input
                id="vehicleBrand"
                name="vehicleBrand"
                type="text"
                placeholder="Enter vehicle brand"
                value={formData.vehicleBrand}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* ── Section 4: Ownership Status Declaration ── */}
        <div className="form-section">
          <h2 className="section-title">Ownership Status Declaration</h2>

          <div className="form-group">
            <label className="field-label">Ownership Status at Time of Infraction</label>
            <div className="radio-group">
              {OWNERSHIP_STATUSES.map((opt) => (
                <label key={opt.value} className="radio-option">
                  <input
                    type="radio"
                    name="ownershipStatus"
                    value={opt.value}
                    checked={formData.ownershipStatus === opt.value}
                    onChange={handleChange}
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* ── Section 5: Ownership Timeline ── */}
        <div className="form-section">
          <h2 className="section-title">Ownership Timeline</h2>

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="dateSold">Date Vehicle Sold</label>
              <input
                id="dateSold"
                name="dateSold"
                type="date"
                value={formData.dateSold}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="datePurchased">Date Vehicle Purchased</label>
              <input
                id="datePurchased"
                name="datePurchased"
                type="date"
                value={formData.datePurchased}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="transferRegistrationDate">Ownership Transfer Registration Date</label>
              <input
                id="transferRegistrationDate"
                name="transferRegistrationDate"
                type="date"
                value={formData.transferRegistrationDate}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* ── Section 6: Supporting Documents Upload ── */}
        <div className="form-section">
          <h2 className="section-title">Supporting Documents Upload</h2>

          <div className="form-grid">
            <div className="form-group form-group--full">
              <label htmlFor="documentType">Document Type</label>
              <select
                id="documentType"
                name="documentType"
                value={formData.documentType}
                onChange={handleChange}
              >
                {DOCUMENT_TYPES.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group form-group--full">
              <label htmlFor="uploadedFile">Upload Document</label>
              <input
                id="uploadedFile"
                name="uploadedFile"
                type="file"
                className="file-input"
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* ── Section 7: Declaration ── */}
        <div className="form-section">
          <h2 className="section-title">Declaration</h2>

          <label className="checkbox-option">
            <input
              type="checkbox"
              name="declarationAccepted"
              checked={formData.declarationAccepted}
              onChange={handleChange}
            />
            <span>
              I declare that the information provided is accurate and that I was not the owner
              of the vehicle at the time of the infraction.
            </span>
          </label>
        </div>

        {submitResult && (
          <div className={`submit-result submit-result--${submitResult.success ? 'success' : 'error'}`}>
            {submitResult.message}
          </div>
        )}

        <button type="submit" className="submit-btn" disabled={submitting}>
          {submitting ? 'Submitting…' : 'Submit'}
        </button>
      </form>
    </div>
  )
}
