import { useState, useRef } from 'react'
import './CaseForm.css'

const INFRACTION_TYPES = [
  { value: '', label: 'Select infraction type' },
  { value: '1', label: 'Traffic fine' },
  { value: '2', label: 'Toll violation' },
  { value: '3', label: 'Other vehicle-related charge' },
]

const OWNERSHIP_STATUSES = [
  { value: '1', label: 'I sold the vehicle before the infraction' },
  { value: '2', label: 'I purchased the vehicle after the infraction' },
  { value: '3', label: 'I never owned the vehicle' },
  { value: '4', label: 'The vehicle was transferred but not yet registered' },
  { value: '5', label: 'Other' },
]

const DOCUMENT_TYPES = [
  { value: '', label: 'Select document type' },
  { value: '1', label: 'Vehicle Sale Contract' },
  { value: '2', label: 'Vehicle Ownership Certificate' },
  { value: '3', label: 'ID Document' },
  { value: '4', label: 'Other Supporting Document' },
]

const initialFormData = {
  trafficFineNumber: '',
  infractionDate: '',
  infractionType: '',
  firstName: '',
  lastName: '',
  dateOfBirth: '',
  address: '',
  vat: '',
  licensePlateNumber: '',
  vin: '',
  vehicleBrand: '',
  ownershipStatus: '',
  dateSold: '',
  datePurchased: '',
  transferRegistrationDate: '',
  documentType: '',
  uploadedFile: null,
  declarationAccepted: false,
}

const API_URL = 'http://localhost:8080/nivi/api/cases'

function validate(formData) {
  const errors = {}
  if (!formData.trafficFineNumber.trim())  errors.trafficFineNumber = 'Required'
  if (!formData.infractionDate)            errors.infractionDate = 'Required'
  if (!formData.infractionType)            errors.infractionType = 'Required'
  if (!formData.firstName.trim())          errors.firstName = 'Required'
  if (!formData.lastName.trim())           errors.lastName = 'Required'
  if (!formData.vat.trim())                errors.vat = 'Required'
  if (!formData.dateOfBirth)               errors.dateOfBirth = 'Required'
  if (!formData.address.trim())            errors.address = 'Required'
  if (!formData.licensePlateNumber.trim()) errors.licensePlateNumber = 'Required'
  if (!formData.vin.trim())                errors.vin = 'Required'
  if (!formData.vehicleBrand.trim())       errors.vehicleBrand = 'Required'
  if (!formData.ownershipStatus)           errors.ownershipStatus = 'Required'
  if (!formData.dateSold)                  errors.dateSold = 'Required'
  if (!formData.datePurchased)             errors.datePurchased = 'Required'
  if (!formData.transferRegistrationDate)  errors.transferRegistrationDate = 'Required'
  if (!formData.documentType)              errors.documentType = 'Required'
  if (!formData.uploadedFile)              errors.uploadedFile = 'Required'
  if (!formData.declarationAccepted)       errors.declarationAccepted = 'You must accept the declaration'
  return errors
}

export default function CaseForm() {
  const [formData, setFormData] = useState(initialFormData)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitResult, setSubmitResult] = useState(null)
  const [fileInputKey, setFileInputKey] = useState(0) // forces file input remount on reset

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target
    if (type === 'checkbox') {
      setFormData((prev) => ({ ...prev, [name]: checked }))
    } else if (type === 'file') {
      setFormData((prev) => ({ ...prev, [name]: files[0] ?? null }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
    // clear error on change
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitResult(null)

    const validationErrors = validate(formData)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setSubmitting(true)

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
        setErrors({})
        setFileInputKey((k) => k + 1) // remount file input → clears it
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
          <img src="https://nivi.it/wp-content/uploads/2025/12/LOGO-NEW.png" alt="Logo" />
        </div>

        {/* ── Section 1: Case Identification ── */}
        <div className="form-section">
          <h2 className="section-title">Case Identification</h2>
          <div className="form-grid">

            <div className="form-group">
              <label htmlFor="trafficFineNumber">Traffic Fine Number <span className="required">*</span></label>
              <input
                id="trafficFineNumber" name="trafficFineNumber" type="text"
                placeholder="Enter traffic fine number"
                value={formData.trafficFineNumber} onChange={handleChange}
                className={errors.trafficFineNumber ? 'input-error' : ''}
              />
              {errors.trafficFineNumber && <span className="field-error">{errors.trafficFineNumber}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="infractionDate">Infraction Date <span className="required">*</span></label>
              <input
                id="infractionDate" name="infractionDate" type="date"
                value={formData.infractionDate} onChange={handleChange}
                className={errors.infractionDate ? 'input-error' : ''}
              />
              {errors.infractionDate && <span className="field-error">{errors.infractionDate}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="infractionType">Infraction Type <span className="required">*</span></label>
              <select
                id="infractionType" name="infractionType"
                value={formData.infractionType} onChange={handleChange}
                className={errors.infractionType ? 'input-error' : ''}
              >
                {INFRACTION_TYPES.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              {errors.infractionType && <span className="field-error">{errors.infractionType}</span>}
            </div>

          </div>
        </div>

        {/* ── Section 2: Applicant Information ── */}
        <div className="form-section">
          <h2 className="section-title">Applicant Information</h2>
          <div className="form-grid">

            <div className="form-group">
              <label htmlFor="firstName">First Name <span className="required">*</span></label>
              <input
                id="firstName" name="firstName" type="text" placeholder="Enter first name"
                value={formData.firstName} onChange={handleChange}
                className={errors.firstName ? 'input-error' : ''}
              />
              {errors.firstName && <span className="field-error">{errors.firstName}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="lastName">Last Name <span className="required">*</span></label>
              <input
                id="lastName" name="lastName" type="text" placeholder="Enter last name"
                value={formData.lastName} onChange={handleChange}
                className={errors.lastName ? 'input-error' : ''}
              />
              {errors.lastName && <span className="field-error">{errors.lastName}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="dateOfBirth">Date of Birth <span className="required">*</span></label>
              <input
                id="dateOfBirth" name="dateOfBirth" type="date"
                value={formData.dateOfBirth} onChange={handleChange}
                className={errors.dateOfBirth ? 'input-error' : ''}
              />
              {errors.dateOfBirth && <span className="field-error">{errors.dateOfBirth}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="vat">VAT <span className="required">*</span></label>
              <input
                id="vat" name="vat" type="text" placeholder="VAT"
                value={formData.vat} onChange={handleChange}
                className={errors.vat ? 'input-error' : ''}
              />
              {errors.vat && <span className="field-error">{errors.vat}</span>}
            </div>

            <div className="form-group form-group--full">
              <label htmlFor="address">Address <span className="required">*</span></label>
              <input
                id="address" name="address" type="text" placeholder="Enter full address"
                value={formData.address} onChange={handleChange}
                className={errors.address ? 'input-error' : ''}
              />
              {errors.address && <span className="field-error">{errors.address}</span>}
            </div>

          </div>
        </div>

        {/* ── Section 3: Vehicle Information ── */}
        <div className="form-section">
          <h2 className="section-title">Vehicle Information</h2>
          <div className="form-grid">

            <div className="form-group">
              <label htmlFor="licensePlateNumber">License Plate Number <span className="required">*</span></label>
              <input
                id="licensePlateNumber" name="licensePlateNumber" type="text"
                placeholder="Enter license plate"
                value={formData.licensePlateNumber} onChange={handleChange}
                className={errors.licensePlateNumber ? 'input-error' : ''}
              />
              {errors.licensePlateNumber && <span className="field-error">{errors.licensePlateNumber}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="vin">Vehicle Identification Number (VIN) <span className="required">*</span></label>
              <input
                id="vin" name="vin" type="text" placeholder="Enter VIN"
                value={formData.vin} onChange={handleChange}
                className={errors.vin ? 'input-error' : ''}
              />
              {errors.vin && <span className="field-error">{errors.vin}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="vehicleBrand">Vehicle Brand <span className="required">*</span></label>
              <input
                id="vehicleBrand" name="vehicleBrand" type="text" placeholder="Enter vehicle brand"
                value={formData.vehicleBrand} onChange={handleChange}
                className={errors.vehicleBrand ? 'input-error' : ''}
              />
              {errors.vehicleBrand && <span className="field-error">{errors.vehicleBrand}</span>}
            </div>

          </div>
        </div>

        {/* ── Section 4: Ownership Status Declaration ── */}
        <div className="form-section">
          <h2 className="section-title">Ownership Status Declaration</h2>
          <div className="form-group">
            <label className="field-label">
              Ownership Status at Time of Infraction <span className="required">*</span>
            </label>
            <div className="radio-group">
              {OWNERSHIP_STATUSES.map((opt) => (
                <label key={opt.value} className="radio-option">
                  <input
                    type="radio" name="ownershipStatus" value={opt.value}
                    checked={formData.ownershipStatus === opt.value}
                    onChange={handleChange}
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
            {errors.ownershipStatus && <span className="field-error">{errors.ownershipStatus}</span>}
          </div>
        </div>

        {/* ── Section 5: Ownership Timeline ── */}
        <div className="form-section">
          <h2 className="section-title">Ownership Timeline</h2>
          <div className="form-grid">

            <div className="form-group">
              <label htmlFor="dateSold">Date Vehicle Sold <span className="required">*</span></label>
              <input
                id="dateSold" name="dateSold" type="date"
                value={formData.dateSold} onChange={handleChange}
                className={errors.dateSold ? 'input-error' : ''}
              />
              {errors.dateSold && <span className="field-error">{errors.dateSold}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="datePurchased">Date Vehicle Purchased <span className="required">*</span></label>
              <input
                id="datePurchased" name="datePurchased" type="date"
                value={formData.datePurchased} onChange={handleChange}
                className={errors.datePurchased ? 'input-error' : ''}
              />
              {errors.datePurchased && <span className="field-error">{errors.datePurchased}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="transferRegistrationDate">Ownership Transfer Registration Date <span className="required">*</span></label>
              <input
                id="transferRegistrationDate" name="transferRegistrationDate" type="date"
                value={formData.transferRegistrationDate} onChange={handleChange}
                className={errors.transferRegistrationDate ? 'input-error' : ''}
              />
              {errors.transferRegistrationDate && <span className="field-error">{errors.transferRegistrationDate}</span>}
            </div>
          </div>
        </div>

        {/* ── Section 6: Supporting Documents Upload ── */}
        <div className="form-section">
          <h2 className="section-title">Supporting Documents Upload</h2>
          <div className="form-grid">

            <div className="form-group form-group--full">
              <label htmlFor="documentType">Document Type <span className="required">*</span></label>
              <select
                id="documentType" name="documentType"
                value={formData.documentType} onChange={handleChange}
                className={errors.documentType ? 'input-error' : ''}
              >
                {DOCUMENT_TYPES.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              {errors.documentType && <span className="field-error">{errors.documentType}</span>}
            </div>

            <div className="form-group form-group--full">
              <label htmlFor="uploadedFile">Upload Document <span className="required">*</span></label>
              <input
                key={fileInputKey}
                id="uploadedFile" name="uploadedFile" type="file"
                className={`file-input${errors.uploadedFile ? ' input-error' : ''}`}
                onChange={handleChange}
              />
              {errors.uploadedFile && <span className="field-error">{errors.uploadedFile}</span>}
            </div>

          </div>
        </div>

        {/* ── Section 7: Declaration ── */}
        <div className="form-section">
          <h2 className="section-title">Declaration</h2>
          <label className="checkbox-option">
            <input
              type="checkbox" name="declarationAccepted"
              checked={formData.declarationAccepted} onChange={handleChange}
            />
            <span>
              I declare that the information provided is accurate and that I was not the owner
              of the vehicle at the time of the infraction. <span className="required">*</span>
            </span>
          </label>
          {errors.declarationAccepted && <span className="field-error">{errors.declarationAccepted}</span>}
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
