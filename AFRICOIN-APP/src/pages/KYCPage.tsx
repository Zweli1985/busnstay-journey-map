import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './KYCPage.css'

export default function KYCPage() {
  const { user, updateKYCStatus, updateProfile } = useAuth()
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [kycData, setKycData] = useState({
    // Personal Information
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    dateOfBirth: '',
    nationality: '',
    documentType: 'passport',
    documentNumber: '',
    documentExpiry: '',
    phoneNumber: user?.phone || '',
    alternatePhone: '',

    // Address
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',

    // Employment
    employmentStatus: 'employed',
    employerName: '',
    jobTitle: '',
    industry: '',

    // Financial
    sourceOfFunds: 'salary',
    annualIncome: '',
    politicallyExposed: false,
    sanctionsDeclaration: false,

    // Verification
    documentsUploaded: false,
    agreedToTerms: false,
    agreedToPrivacy: false
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked

    setKycData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    setError('')
  }

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        if (!kycData.firstName || !kycData.lastName || !kycData.dateOfBirth || !kycData.nationality) {
          setError('Please fill in all required fields')
          return false
        }
        if (!/^\d{4}-\d{2}-\d{2}$/.test(kycData.dateOfBirth)) {
          setError('Invalid date format. Use YYYY-MM-DD')
          return false
        }
        return true

      case 2:
        if (!kycData.documentType || !kycData.documentNumber || !kycData.documentExpiry) {
          setError('Please fill in all document fields')
          return false
        }
        if (!kycData.documentsUploaded) {
          setError('Please upload required documents')
          return false
        }
        return true

      case 3:
        if (!kycData.street || !kycData.city || !kycData.country || !kycData.postalCode) {
          setError('Please fill in all address fields')
          return false
        }
        return true

      case 4:
        if (!kycData.employmentStatus || !kycData.annualIncome) {
          setError('Please fill in employment and income information')
          return false
        }
        if (!kycData.agreedToTerms || !kycData.agreedToPrivacy) {
          setError('You must agree to the terms and privacy policy')
          return false
        }
        return true

      default:
        return true
    }
  }

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      setError('')
    }
  }

  const handleSubmit = async () => {
    if (!validateStep(4)) return

    setLoading(true)
    setError('')

    try {
      // Simulate API call to verify KYC
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Update user profile with KYC data
      updateProfile({
        phone: kycData.phoneNumber,
        verified: true
      })

      // Update KYC status
      updateKYCStatus('verified')

      // Redirect to dashboard
      navigate('/dashboard')
    } catch (err) {
      setError('KYC submission failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const steps = ['Personal', 'Documents', 'Address', 'Employment', 'Verify']

  return (
    <div className="kyc-page">
      <div className="kyc-bg-orb"></div>
      <div className="kyc-bg-orb-2"></div>

      <div className="kyc-container">
        <div className="kyc-header">
          <h1>Know Your Customer (KYC) Verification</h1>
          <p>Complete your identity verification to unlock all features</p>
        </div>

        <div className="kyc-progress">
          {steps.map((step, index) => (
            <div
              key={step}
              className={`progress-step ${index + 1 <= currentStep ? 'active' : ''} ${
                index + 1 === currentStep ? 'current' : ''
              }`}
            >
              <div className="step-circle">{index + 1}</div>
              <span className="step-label">{step}</span>
            </div>
          ))}
        </div>

        <div className="kyc-card">
          {error && (
            <div className="kyc-error">
              <i className="fas fa-exclamation-circle"></i>
              {error}
            </div>
          )}

          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <div className="kyc-step">
              <h2>Personal Information</h2>
              <p>Please provide your basic personal details</p>

              <div className="form-row">
                <div className="form-group">
                  <label>First Name *</label>
                  <input
                    type="text"
                    name="firstName"
                    value={kycData.firstName}
                    onChange={handleInputChange}
                    placeholder="John"
                  />
                </div>
                <div className="form-group">
                  <label>Last Name *</label>
                  <input
                    type="text"
                    name="lastName"
                    value={kycData.lastName}
                    onChange={handleInputChange}
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Date of Birth *</label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={kycData.dateOfBirth}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Nationality *</label>
                  <select name="nationality" value={kycData.nationality} onChange={handleInputChange}>
                    <option value="">Select country</option>
                    <option value="south-africa">South Africa</option>
                    <option value="brazil">Brazil</option>
                    <option value="india">India</option>
                    <option value="russia">Russia</option>
                    <option value="china">China</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={kycData.phoneNumber}
                  onChange={handleInputChange}
                  placeholder="+1234567890"
                />
              </div>
            </div>
          )}

          {/* Step 2: Documents */}
          {currentStep === 2 && (
            <div className="kyc-step">
              <h2>Identity Documents</h2>
              <p>Upload a valid government-issued document</p>

              <div className="form-row">
                <div className="form-group">
                  <label>Document Type *</label>
                  <select name="documentType" value={kycData.documentType} onChange={handleInputChange}>
                    <option value="passport">Passport</option>
                    <option value="national-id">National ID</option>
                    <option value="drivers-license">Driver's License</option>
                    <option value="birth-cert">Birth Certificate</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Document Number *</label>
                  <input
                    type="text"
                    name="documentNumber"
                    value={kycData.documentNumber}
                    onChange={handleInputChange}
                    placeholder="ABC123456"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Document Expiry Date *</label>
                <input
                  type="date"
                  name="documentExpiry"
                  value={kycData.documentExpiry}
                  onChange={handleInputChange}
                />
              </div>

              <div className="document-upload">
                <div className="upload-box">
                  <i className="fas fa-cloud-upload-alt"></i>
                  <p>Click to upload or drag and drop</p>
                  <span>PDF, JPG or PNG (max. 10MB)</span>
                  <input
                    type="checkbox"
                    name="documentsUploaded"
                    checked={kycData.documentsUploaded}
                    onChange={handleInputChange}
                    style={{ display: 'none' }}
                    id="doc-upload"
                  />
                  <label htmlFor="doc-upload" className="upload-label">
                    Select files
                  </label>
                </div>
              </div>

              {kycData.documentsUploaded && (
                <div className="upload-success">
                  <i className="fas fa-check-circle"></i>
                  Documents uploaded successfully
                </div>
              )}
            </div>
          )}

          {/* Step 3: Address */}
          {currentStep === 3 && (
            <div className="kyc-step">
              <h2>Residential Address</h2>
              <p>Provide your current residential address</p>

              <div className="form-group">
                <label>Street Address *</label>
                <input
                  type="text"
                  name="street"
                  value={kycData.street}
                  onChange={handleInputChange}
                  placeholder="123 Main Street"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>City *</label>
                  <input
                    type="text"
                    name="city"
                    value={kycData.city}
                    onChange={handleInputChange}
                    placeholder="Johannesburg"
                  />
                </div>
                <div className="form-group">
                  <label>State/Province</label>
                  <input
                    type="text"
                    name="state"
                    value={kycData.state}
                    onChange={handleInputChange}
                    placeholder="Gauteng"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Postal Code *</label>
                  <input
                    type="text"
                    name="postalCode"
                    value={kycData.postalCode}
                    onChange={handleInputChange}
                    placeholder="1000"
                  />
                </div>
                <div className="form-group">
                  <label>Country *</label>
                  <select name="country" value={kycData.country} onChange={handleInputChange}>
                    <option value="">Select country</option>
                    <option value="south-africa">South Africa</option>
                    <option value="brazil">Brazil</option>
                    <option value="india">India</option>
                    <option value="russia">Russia</option>
                    <option value="china">China</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Employment & Compliance */}
          {currentStep === 4 && (
            <div className="kyc-step">
              <h2>Employment & Compliance</h2>
              <p>Final verification steps</p>

              <div className="form-row">
                <div className="form-group">
                  <label>Employment Status *</label>
                  <select name="employmentStatus" value={kycData.employmentStatus} onChange={handleInputChange}>
                    <option value="employed">Employed</option>
                    <option value="self-employed">Self-Employed</option>
                    <option value="unemployed">Unemployed</option>
                    <option value="student">Student</option>
                    <option value="retired">Retired</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Annual Income *</label>
                  <select name="annualIncome" value={kycData.annualIncome} onChange={handleInputChange}>
                    <option value="">Select range</option>
                    <option value="0-50k">$0 - $50,000</option>
                    <option value="50k-100k">$50,000 - $100,000</option>
                    <option value="100k-250k">$100,000 - $250,000</option>
                    <option value="250k+">$250,000+</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Source of Funds</label>
                <select name="sourceOfFunds" value={kycData.sourceOfFunds} onChange={handleInputChange}>
                  <option value="salary">Salary</option>
                  <option value="business">Business</option>
                  <option value="investments">Investments</option>
                  <option value="inheritance">Inheritance</option>
                  <option value="savings">Savings</option>
                </select>
              </div>

              <div className="compliance-checks">
                <label className="check-item">
                  <input
                    type="checkbox"
                    name="politicallyExposed"
                    checked={kycData.politicallyExposed}
                    onChange={handleInputChange}
                  />
                  <span>I confirm that I am not a politically exposed person (PEP)</span>
                </label>

                <label className="check-item">
                  <input
                    type="checkbox"
                    name="sanctionsDeclaration"
                    checked={kycData.sanctionsDeclaration}
                    onChange={handleInputChange}
                  />
                  <span>I am not subject to sanctions or legal restrictions</span>
                </label>

                <label className="check-item">
                  <input
                    type="checkbox"
                    name="agreedToTerms"
                    checked={kycData.agreedToTerms}
                    onChange={handleInputChange}
                  />
                  <span>I agree to the Terms of Service</span>
                </label>

                <label className="check-item">
                  <input
                    type="checkbox"
                    name="agreedToPrivacy"
                    checked={kycData.agreedToPrivacy}
                    onChange={handleInputChange}
                  />
                  <span>I agree to the Privacy Policy</span>
                </label>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="kyc-actions">
            {currentStep > 1 && (
              <button className="btn-secondary" onClick={handlePrevStep} disabled={loading}>
                <i className="fas fa-arrow-left"></i>
                Previous
              </button>
            )}

            {currentStep < 5 && (
              <button className="btn-primary" onClick={handleNextStep} disabled={loading}>
                Next <i className="fas fa-arrow-right"></i>
              </button>
            )}

            {currentStep === 5 && (
              <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Verifying...
                  </>
                ) : (
                  <>
                    <i className="fas fa-check"></i>
                    Complete Verification
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
