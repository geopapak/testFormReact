import { useState } from 'react'
import './CaseForm.css'

const INFRACTION_TYPES = [
  { value: '', label: 'Select infraction type' },
  { value: 'traffic_fine', label: 'Traffic fine' },
  { value: 'toll_violation', label: 'Toll violation' },
  { value: 'other', label: 'Other vehicle-related charge' },
]

const initialFormData = {
  // Section 1 – Case Identification
  trafficFineNumber: '',
  infractionDate: '',
  infractionType: '',
}

export default function CaseForm() {
  const [formData, setFormData] = useState(initialFormData)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    alert('Form submitted successfully!')
  }

  return (
    <div className="form-wrapper">
      <form className="case-form" onSubmit={handleSubmit} noValidate>

        {/* ── Section 1: Case Identification ── */}
        <div className="form-section">
          <h2 className="section-title">Case Identification</h2>

          <div className="form-grid">
            {/* Traffic Fine Number */}
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

            {/* Infraction Date */}
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

            {/* Infraction Type */}
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

        {/* ── Section 2: Applicant Information (placeholder) ── */}
        <div className="form-section">
          <h2 className="section-title">Applicant Information</h2>
          <p className="section-placeholder">More fields coming soon…</p>
        </div>

        <button type="submit" className="submit-btn">Submit</button>
      </form>
    </div>
  )
}
