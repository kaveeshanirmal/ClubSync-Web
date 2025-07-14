'use client';

import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { 
  CheckCircle, 
  Upload, 
  AlertCircle, 
  ChevronRight, 
  ChevronLeft,
  HelpCircle,
  FileText,
  Users,
  Calendar,
  Shield,
  Building2,
  User,
  FileImage,
  CheckSquare,
  ArrowRight
} from 'lucide-react';

// Interface for form values
interface ClubVerificationFormValues {
  // Club Details
  clubName: string;
  clubType: string;
  description: string;
  affiliation: string;
  clubCategory: string; // new field

  // Primary Contact
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  contactPosition: string;
  contactIdProof: File | null;

  // Documentation Upload
  clubConstitution: File | null;
  approvalLetter: File | null;
  meetingMinutes: File | null;
  clubLogo: File | null;

  // Planned Activities
  upcomingEvent1: string;
  upcomingEvent2: string;
  expectedMembers: number;
  focusAreas: string[];

  // Agreements
  isOfficialRepresentative: boolean;
  documentsVerified: boolean;
  agreeToTerms: boolean;
}

// Focus areas options
const focusAreas = [
  { id: 'social', label: 'Social' },
  { id: 'tech', label: 'Technology' },
  { id: 'sports', label: 'Sports' },
  { id: 'cultural', label: 'Cultural' },
  { id: 'academic', label: 'Academic' },
  { id: 'environmental', label: 'Environmental' },
  { id: 'community', label: 'Community Service' },
];

// Club types
const clubTypes = [
  { value: 'academic', label: 'Academic' },
  { value: 'sports', label: 'Sports' },
  { value: 'cultural', label: 'Cultural' },
  { value: 'volunteer', label: 'Volunteer' },
  { value: 'professional', label: 'Professional' },
  { value: 'hobby', label: 'Hobby' },
  { value: 'other', label: 'Other' },
];

// Form steps configuration
const formSteps = [
  {
    id: 1,
    title: 'Club Details',
    icon: <Building2 className="w-5 h-5" />,
    description: 'Basic information about your club'
  },
  {
    id: 2,
    title: 'Contact Information',
    icon: <User className="w-5 h-5" />,
    description: 'Primary contact details'
  },
  {
    id: 3,
    title: 'Documentation',
    icon: <FileText className="w-5 h-5" />,
    description: 'Required documents and files'
  },
  {
    id: 4,
    title: 'Activities & Goals',
    icon: <Calendar className="w-5 h-5" />,
    description: 'Planned activities and focus areas'
  },
  {
    id: 5,
    title: 'Agreements',
    icon: <CheckSquare className="w-5 h-5" />,
    description: 'Terms and confirmations'
  }
];

// Tooltip component
const Tooltip = ({ children, content }: { children: React.ReactNode; content: string }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className="inline-flex items-center cursor-help"
      >
        {children}
        <HelpCircle className="w-4 h-4 ml-1 text-gray-400 hover:text-orange-500 transition-colors" />
      </div>
      {isVisible && (
        <div className="absolute z-10 w-64 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg -top-2 left-full ml-2">
          {content}
          <div className="absolute top-3 -left-1 w-2 h-2 bg-gray-900 transform rotate-45"></div>
        </div>
      )}
    </div>
  );
};

// Progress stepper component
const ProgressStepper = ({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-700">
          Step {currentStep} of {totalSteps}
        </h2>
        <div className="text-sm text-gray-500">
          {Math.round((currentStep / totalSteps) * 100)}% Complete
        </div>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        ></div>
      </div>
      <div className="flex justify-between mt-3">
        {formSteps.map((step, index) => (
          <div key={step.id} className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
              index + 1 < currentStep
                ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                : index + 1 === currentStep
                ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                : 'bg-gray-200 text-gray-500'
            }`}>
              {index + 1 < currentStep ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                step.icon
              )}
            </div>
            <span className={`text-xs mt-1 text-center max-w-16 ${
              index + 1 === currentStep ? 'text-orange-600 font-medium' : 'text-gray-500'
            }`}>
              {step.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Enhanced file upload component
const FileUpload = ({ 
  name, 
  label, 
  accept, 
  required = false,
  setFieldValue,
  tooltip,
  currentStep,
  errors,
  touched
}: { 
  name: string; 
  label: string; 
  accept: string;
  required?: boolean;
  setFieldValue: (field: string, value: any) => void;
  tooltip?: string;
  currentStep: number;
  errors: any;
  touched: any;
}) => {
  const [fileName, setFileName] = useState<string>('No file chosen');
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      setFileName(file.name);
      setFieldValue(name, file);
    } else {
      setFileName('No file chosen');
      setFieldValue(name, null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setFileName(file.name);
      setFieldValue(name, file);
    }
  };

  const labelContent = tooltip ? (
    <Tooltip content={tooltip}>
      <span>{label} {required && <span className="text-red-500">*</span>}</span>
    </Tooltip>
  ) : (
    <span>{label} {required && <span className="text-red-500">*</span>}</span>
  );

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor={name}>
        {labelContent}
      </label>
      <div 
        className={`border-2 border-dashed rounded-lg p-6 transition-all duration-200 ${
          isDragOver 
            ? 'border-orange-400 bg-orange-50' 
            : 'border-gray-300 hover:border-orange-300 hover:bg-gray-50'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="text-center">
          <Upload className={`mx-auto h-12 w-12 mb-4 transition-colors ${
            isDragOver ? 'text-orange-500' : 'text-gray-400'
          }`} />
          <div className="flex items-center text-sm text-gray-600">
            <label
              htmlFor={name}
              className="relative cursor-pointer bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-md font-medium px-4 py-2 hover:from-orange-600 hover:to-red-600 transition-all duration-200 transform hover:scale-105"
            >
              Choose a file
              <input
                id={name}
                name={name}
                type="file"
                accept={accept}
                onChange={handleFileChange}
                className="sr-only"
              />
            </label>
            <p className="pl-3 text-gray-500 font-medium">or drag and drop</p>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {fileName !== 'No file chosen' ? fileName : `Accepted formats: ${accept}`}
          </p>
        </div>
      </div>
              {currentStep === 3 && errors[name] && touched[name] && (
          <div className="mt-1 text-sm text-red-500">{errors[name]}</div>
        )}
    </div>
  );
};

// Validation schema
const onlyNumbersRegex = /^\d+$/;
const onlySpecialCharsRegex = /^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]+$/;
const notOnlyNumbersOrSpecialChars = (msg: string) =>
  Yup.string().test('not-only-numbers-or-special', msg, value => {
    if (!value) return true; // Let required validation handle empty values
    return !onlyNumbersRegex.test(value) && !onlySpecialCharsRegex.test(value);
  });

const ClubVerificationSchema = Yup.object().shape({
  // Club Details
  clubName: notOnlyNumbersOrSpecialChars('Club name cannot be only numbers or special characters').required('Club name is required'),
  clubType: Yup.string().required('Club type is required'),
  description: notOnlyNumbersOrSpecialChars('Description cannot be only numbers or special characters')
    .max(300, 'Description must be 300 characters or less')
    .required('Description is required'),
  affiliation: notOnlyNumbersOrSpecialChars('Affiliation cannot be only numbers or special characters').required('University/Organization is required'),
  clubCategory: Yup.string().oneOf(['community', 'institute'], 'Select a club category').required('Club category is required'),

  // Primary Contact
  contactName: notOnlyNumbersOrSpecialChars('Contact name cannot be only numbers or special characters').required('Contact name is required'),
  contactEmail: Yup.string()
    .email('Invalid email address')
    .required('Contact email is required'),
  contactPhone: Yup.string()
    .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits')
    .required('Contact phone is required'),
  contactPosition: notOnlyNumbersOrSpecialChars('Position cannot be only numbers or special characters').required('Position is required'),
  
  // Documentation
  approvalLetter: Yup.mixed().required('Approval letter is required'),
  
  // Planned Activities
  upcomingEvent1: notOnlyNumbersOrSpecialChars('Event name/description cannot be only numbers or special characters').required('At least one upcoming event is required'),
  expectedMembers: Yup.number()
    .min(1, 'Must have at least one member')
    .required('Expected member count is required'),
  focusAreas: Yup.array()
    .min(1, 'Select at least one focus area')
    .required('Focus areas are required'),

  // Agreements
  isOfficialRepresentative: Yup.boolean().oneOf([true], 'You must confirm you are an official representative'),
  documentsVerified: Yup.boolean().oneOf([true], 'You must confirm your documents are verified'),
  agreeToTerms: Yup.boolean().oneOf([true], 'You must agree to the terms and conditions'),
});

export default function ClubVerificationPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [verificationStatus, setVerificationStatus] = useState<'PENDING' | 'APPROVED' | 'REJECTED'>('PENDING');

  // Map step to relevant field names for validation
  const stepFields: { [key: number]: string[] } = {
    1: ['clubName', 'clubType', 'description', 'affiliation', 'clubCategory'],
    2: ['contactName', 'contactEmail', 'contactPhone', 'contactPosition', 'contactIdProof'],
    3: ['clubConstitution', 'approvalLetter', 'meetingMinutes', 'clubLogo'],
    4: ['upcomingEvent1', 'expectedMembers', 'focusAreas'],
    5: ['isOfficialRepresentative', 'documentsVerified', 'agreeToTerms'],
  };

  const initialValues: ClubVerificationFormValues = {
    clubName: '',
    clubType: '',
    description: '',
    affiliation: '',
    clubCategory: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    contactPosition: '',
    contactIdProof: null,
    clubConstitution: null,
    approvalLetter: null,
    meetingMinutes: null,
    clubLogo: null,
    upcomingEvent1: '',
    upcomingEvent2: '',
    expectedMembers: 0,
    focusAreas: [],
    isOfficialRepresentative: false,
    documentsVerified: false,
    agreeToTerms: false,
  };

  const handleSubmit = (
    values: ClubVerificationFormValues,
    { setSubmitting }: FormikHelpers<ClubVerificationFormValues>
  ) => {
    console.log('Form submitted with values:', values);
    
    // Mock submission success
    setTimeout(() => {
      alert('Form submitted successfully! Your club verification request is now pending approval.');
      setSubmitting(false);
    }, 1000);
  };

  const nextStep = () => {
    if (currentStep < formSteps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = (errors: any, touched: any, setFieldValue: any) => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="clubName" className="block text-sm font-medium text-gray-700 mb-2">
                  Club Name <span className="text-red-500">*</span>
                </label>
                <Field
                  type="text"
                  name="clubName"
                  id="clubName"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-200 ${
                    errors.clubName && touched.clubName
                      ? 'border-red-500'
                      : 'border-gray-300 hover:border-orange-300'
                  }`}
                  placeholder="Enter your club name"
                />
                {currentStep === 1 && errors.clubName && touched.clubName && (
                  <div className="mt-1 text-sm text-red-500">{errors.clubName}</div>
                )}
              </div>

              <div>
                <label htmlFor="clubCategory" className="block text-sm font-medium text-gray-700 mb-2">
                  Club Category <span className="text-red-500">*</span>
                </label>
                <div className="flex space-x-6">
                  <label className="flex items-center space-x-2">
                    <Field type="radio" name="clubCategory" value="community" className="accent-orange-500" />
                    <span>Community-Based Club</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <Field type="radio" name="clubCategory" value="institute" className="accent-orange-500" />
                    <span>Institute-Based Club</span>
                  </label>
                </div>
                {currentStep === 1 && errors.clubCategory && touched.clubCategory && (
                  <div className="mt-1 text-sm text-red-500">{errors.clubCategory}</div>
                )}
              </div>

              <div>
                <label htmlFor="clubType" className="block text-sm font-medium text-gray-700 mb-2">
                  Club Type <span className="text-red-500">*</span>
                </label>
                <Field
                  as="select"
                  name="clubType"
                  id="clubType"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-200 ${
                    errors.clubType && touched.clubType
                      ? 'border-red-500'
                      : 'border-gray-300 hover:border-orange-300'
                  }`}
                >
                  <option value="">Select Club Type</option>
                  {clubTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </Field>
                {currentStep === 1 && errors.clubType && touched.clubType && (
                  <div className="mt-1 text-sm text-red-500">{errors.clubType}</div>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description <span className="text-red-500">*</span>
                <span className="ml-2 text-xs text-gray-500">(Max 300 characters)</span>
              </label>
              <Field
                as="textarea"
                name="description"
                id="description"
                rows={4}
                maxLength={300}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-200 resize-none ${
                  errors.description && touched.description
                    ? 'border-red-500'
                    : 'border-gray-300 hover:border-orange-300'
                }`}
                placeholder="Describe your club's mission, activities, and goals..."
              />
                             {currentStep === 1 && errors.description && touched.description && (
                 <div className="text-sm text-red-500">{errors.description}</div>
               )}
              <div className="mt-2 flex justify-between">
                <Field name="description">
                  {({ field }: { field: any }) => (
                    <span className="text-xs text-gray-500">
                      {field.value.length}/300
                    </span>
                  )}
                </Field>
              </div>
            </div>

            <div>
              <label htmlFor="affiliation" className="block text-sm font-medium text-gray-700 mb-2">
                University/Organization Affiliation <span className="text-red-500">*</span>
              </label>
              <Field
                type="text"
                name="affiliation"
                id="affiliation"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-200 ${
                  errors.affiliation && touched.affiliation
                    ? 'border-red-500'
                    : 'border-gray-300 hover:border-orange-300'
                }`}
                placeholder="e.g., University of California, Santa Cruz"
              />
                              {currentStep === 1 && errors.affiliation && touched.affiliation && (
                  <div className="mt-1 text-sm text-red-500">{errors.affiliation}</div>
                )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="contactName" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <Field
                  type="text"
                  name="contactName"
                  id="contactName"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-200 ${
                    errors.contactName && touched.contactName
                      ? 'border-red-500'
                      : 'border-gray-300 hover:border-orange-300'
                  }`}
                  placeholder="Enter your full name"
                />
                {currentStep === 2 && errors.contactName && touched.contactName && (
                  <div className="mt-1 text-sm text-red-500">{errors.contactName}</div>
                )}
              </div>

              <div>
                <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-2">
                  University Email <span className="text-red-500">*</span>
                </label>
                <Field
                  type="email"
                  name="contactEmail"
                  id="contactEmail"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-200 ${
                    errors.contactEmail && touched.contactEmail
                      ? 'border-red-500'
                      : 'border-gray-300 hover:border-orange-300'
                  }`}
                  placeholder="your.email@university.edu"
                />
                {currentStep === 2 && errors.contactEmail && touched.contactEmail && (
                  <div className="mt-1 text-sm text-red-500">{errors.contactEmail}</div>
                )}
              </div>

              <div>
                <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <Field
                  type="tel"
                  name="contactPhone"
                  id="contactPhone"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-200 ${
                    errors.contactPhone && touched.contactPhone
                      ? 'border-red-500'
                      : 'border-gray-300 hover:border-orange-300'
                  }`}
                  placeholder="1234567890"
                />
                {currentStep === 2 && errors.contactPhone && touched.contactPhone && (
                  <div className="mt-1 text-sm text-red-500">{errors.contactPhone}</div>
                )}
              </div>

              <div>
                <label htmlFor="contactPosition" className="block text-sm font-medium text-gray-700 mb-2">
                  Designation / Position <span className="text-red-500">*</span>
                </label>
                <Field
                  type="text"
                  name="contactPosition"
                  id="contactPosition"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-200 ${
                    errors.contactPosition && touched.contactPosition
                      ? 'border-red-500'
                      : 'border-gray-300 hover:border-orange-300'
                  }`}
                  placeholder="e.g., President, Secretary, etc."
                />
                {currentStep === 2 && errors.contactPosition && touched.contactPosition && (
                  <div className="mt-1 text-sm text-red-500">{errors.contactPosition}</div>
                )}
              </div>
            </div>

                          <FileUpload
                name="contactIdProof"
                label="Upload ID Proof"
                accept=".pdf,.jpg,.jpeg,.png"
                required={true}
                setFieldValue={setFieldValue}
                tooltip="Upload a valid government ID or university ID card for verification"
                currentStep={currentStep}
                errors={errors}
                touched={touched}
              />
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <FileUpload
              name="clubConstitution"
              label="Club Constitution"
              accept=".pdf,.docx"
              setFieldValue={setFieldValue}
              tooltip="Upload your club's constitution or bylaws document"
              currentStep={currentStep}
              errors={errors}
              touched={touched}
            />

            <FileUpload
              name="approvalLetter"
              label="Official Approval Letter"
              accept=".pdf,.docx,.jpg,.jpeg,.png"
              required={true}
              setFieldValue={setFieldValue}
              tooltip="Upload the official approval letter from your university or organization"
              currentStep={currentStep}
              errors={errors}
              touched={touched}
            />

            <FileUpload
              name="meetingMinutes"
              label="Recent Meeting Minutes"
              accept=".pdf,.docx"
              setFieldValue={setFieldValue}
              tooltip="Upload minutes from your most recent club meeting (optional)"
              currentStep={currentStep}
              errors={errors}
              touched={touched}
            />

            <FileUpload
              name="clubLogo"
              label="Club Logo"
              accept=".jpg,.jpeg,.png,.svg"
              setFieldValue={setFieldValue}
              tooltip="Upload your club's logo or emblem (optional)"
              currentStep={currentStep}
              errors={errors}
              touched={touched}
            />
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="upcomingEvent1" className="block text-sm font-medium text-gray-700 mb-2">
                  Upcoming Event 1 <span className="text-red-500">*</span>
                </label>
                <Field
                  type="text"
                  name="upcomingEvent1"
                  id="upcomingEvent1"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-200 ${
                    errors.upcomingEvent1 && touched.upcomingEvent1
                      ? 'border-red-500'
                      : 'border-gray-300 hover:border-orange-300'
                  }`}
                  placeholder="Event name & brief description"
                />
                {currentStep === 4 && errors.upcomingEvent1 && touched.upcomingEvent1 && (
                  <div className="mt-1 text-sm text-red-500">{errors.upcomingEvent1}</div>
                )}
              </div>

              <div>
                <label htmlFor="upcomingEvent2" className="block text-sm font-medium text-gray-700 mb-2">
                  Upcoming Event 2
                </label>
                <Field
                  type="text"
                  name="upcomingEvent2"
                  id="upcomingEvent2"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-200 hover:border-orange-300"
                  placeholder="Event name & brief description"
                />
              </div>
            </div>

            <div>
              <label htmlFor="expectedMembers" className="block text-sm font-medium text-gray-700 mb-2">
                Expected Number of Members <span className="text-red-500">*</span>
              </label>
              <Field
                type="number"
                name="expectedMembers"
                id="expectedMembers"
                min="1"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-200 ${
                  errors.expectedMembers && touched.expectedMembers
                    ? 'border-red-500'
                    : 'border-gray-300 hover:border-orange-300'
                }`}
                placeholder="Enter expected member count"
              />
                              {currentStep === 4 && errors.expectedMembers && touched.expectedMembers && (
                  <div className="mt-1 text-sm text-red-500">{errors.expectedMembers}</div>
                )}
            </div>

            <div>
              <span className="block text-sm font-medium text-gray-700 mb-3">
                Focus Areas <span className="text-red-500">*</span>
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {focusAreas.map((area) => (
                  <div key={area.id} className="flex items-center">
                    <Field
                      type="checkbox"
                      name="focusAreas"
                      id={`focusArea-${area.id}`}
                      value={area.id}
                      className="h-5 w-5 text-orange-500 rounded border-gray-300 focus:ring-orange-500 transition-all duration-200"
                    />
                    <label
                      htmlFor={`focusArea-${area.id}`}
                      className="ml-3 block text-sm text-gray-700 cursor-pointer hover:text-orange-600 transition-colors"
                    >
                      {area.label}
                    </label>
                  </div>
                ))}
              </div>
                              {currentStep === 4 && errors.focusAreas && touched.focusAreas && (
                  <div className="mt-1 text-sm text-red-500">{errors.focusAreas}</div>
                )}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-start">
                <Shield className="w-5 h-5 text-orange-600 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-medium text-orange-800 mb-2">Important Information</h3>
                  <p className="text-sm text-orange-700">
                    Please review all information carefully before submitting. Once submitted, your club verification request will be reviewed by our team.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <Field
                    type="checkbox"
                    name="isOfficialRepresentative"
                    id="isOfficialRepresentative"
                    className="h-5 w-5 text-orange-500 rounded border-gray-300 focus:ring-orange-500 transition-all duration-200"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="isOfficialRepresentative" className="text-gray-700 cursor-pointer hover:text-orange-600 transition-colors">
                    I confirm that I am an official representative of this club <span className="text-red-500">*</span>
                  </label>
                  {currentStep === 5 && errors.isOfficialRepresentative && touched.isOfficialRepresentative && (
                    <div className="mt-1 text-sm text-red-500">{errors.isOfficialRepresentative}</div>
                  )}
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <Field
                    type="checkbox"
                    name="documentsVerified"
                    id="documentsVerified"
                    className="h-5 w-5 text-orange-500 rounded border-gray-300 focus:ring-orange-500 transition-all duration-200"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="documentsVerified" className="text-gray-700 cursor-pointer hover:text-orange-600 transition-colors">
                    All documents are verified by the university/organization <span className="text-red-500">*</span>
                  </label>
                  {currentStep === 5 && errors.documentsVerified && touched.documentsVerified && (
                    <div className="mt-1 text-sm text-red-500">{errors.documentsVerified}</div>
                  )}
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <Field
                    type="checkbox"
                    name="agreeToTerms"
                    id="agreeToTerms"
                    className="h-5 w-5 text-orange-500 rounded border-gray-300 focus:ring-orange-500 transition-all duration-200"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="agreeToTerms" className="text-gray-700 cursor-pointer hover:text-orange-600 transition-colors">
                    I agree to the platform's{' '}
                    <a href="#" className="text-orange-500 hover:text-orange-600 underline transition-colors">
                      Terms & Conditions
                    </a>{' '}
                    <span className="text-red-500">*</span>
                  </label>
                  {currentStep === 5 && errors.agreeToTerms && touched.agreeToTerms && (
                    <div className="mt-1 text-sm text-red-500">{errors.agreeToTerms}</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="relative min-h-screen bg-white pt-24 pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Creative colored bubbles */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute top-[-60px] left-[-60px] w-72 h-72 bg-orange-100 rounded-full filter blur-2xl opacity-40" />
        <div className="absolute bottom-[-80px] right-[-80px] w-96 h-96 bg-purple-100 rounded-full filter blur-3xl opacity-30" />
        <div className="absolute top-1/3 right-[-40px] w-40 h-40 bg-orange-200 rounded-full filter blur-xl opacity-30" />
        <div className="absolute bottom-1/4 left-[-40px] w-32 h-32 bg-purple-200 rounded-full filter blur-xl opacity-20" />
      </div>
      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4 group">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors duration-300">
              Create New Club
            </h1>
          </div>
          <p className="text-lg text-gray-600 mb-6">
            Complete this form to register and verify your club on ClubSync
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          <Formik
            initialValues={initialValues}
            validationSchema={ClubVerificationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, isSubmitting, setFieldValue, values, validateForm, setTouched }) => {
              // Helper to validate only current step fields
              const validateCurrentStep = async () => {
                const fields = stepFields[currentStep] || [];
                // Mark all fields in this step as touched
                await setTouched(
                  fields.reduce((acc, field) => ({ ...acc, [field]: true }), {}),
                  true
                );
                // Validate the form
                const formErrors = await validateForm();
                // Only allow next if none of the current step fields have errors
                return fields.every((field) => !(formErrors as Record<string, any>)[field]);
              };
              return (
                <Form className="space-y-8">
                  <ProgressStepper currentStep={currentStep} totalSteps={formSteps.length} />
                  <div className="min-h-[400px]">
                    {renderStepContent(errors, touched, setFieldValue)}
                  </div>
                  {/* Navigation Buttons */}
                  <div className="flex justify-between pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={prevStep}
                      disabled={currentStep === 1}
                      className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                        currentStep === 1
                          ? 'text-gray-400 cursor-not-allowed'
                          : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50'
                      }`}
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Previous</span>
                    </button>

                    {currentStep < formSteps.length ? (
                      <button
                        type="button"
                        onClick={async () => {
                          const valid = await validateCurrentStep();
                          if (valid) nextStep();
                        }}
                        className="flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-lg font-medium hover:from-orange-600 hover:to-red-600 transition-all duration-200 transform hover:scale-105"
                      >
                        <span>Next</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-lg font-medium hover:from-orange-600 hover:to-red-600 transition-all duration-200 transform hover:scale-105 ${
                          isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                        }`}
                      >
                        {isSubmitting ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Processing...</span>
                          </>
                        ) : (
                          <>
                            <span>Submit for Verification</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </Form>
              );
            }}
          </Formik>
        </div>
      </div>
    </div>
  );
}
