'use client';

import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { CheckCircle, Upload, AlertCircle } from 'lucide-react';

// Interface for form values
interface ClubVerificationFormValues {
  // Club Details
  clubName: string;
  clubType: string;
  description: string;
  affiliation: string;

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

// Status badge component
const StatusBadge = ({ status }: { status: 'PENDING' | 'APPROVED' | 'REJECTED' }) => {
  const getBadgeColor = () => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'REJECTED':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'PENDING':
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const getIcon = () => {
    switch (status) {
      case 'APPROVED':
        return <CheckCircle className="w-4 h-4" />;
      case 'REJECTED':
        return <AlertCircle className="w-4 h-4" />;
      case 'PENDING':
      default:
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${getBadgeColor()}`}>
      {getIcon()}
      <span className="font-medium text-sm">{status.charAt(0) + status.slice(1).toLowerCase()}</span>
    </div>
  );
};

// File upload component
const FileUpload = ({ 
  name, 
  label, 
  accept, 
  required = false,
  setFieldValue
}: { 
  name: string; 
  label: string; 
  accept: string;
  required?: boolean;
  setFieldValue: (field: string, value: any) => void;
}) => {
  const [fileName, setFileName] = useState<string>('No file chosen');

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

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor={name}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="mt-1 flex items-center">
        <label 
          htmlFor={name}
          className="cursor-pointer px-4 py-2 border border-gray-300 rounded-l-md bg-gray-50 hover:bg-gray-100 transition-colors"
        >
          <Upload className="w-4 h-4 inline-block mr-2" />
          Browse
        </label>
        <div className="flex-grow border border-l-0 border-gray-300 rounded-r-md px-3 py-2 text-sm text-gray-500 truncate">
          {fileName}
        </div>
        <input
          id={name}
          name={name}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="sr-only"
        />
      </div>
      <ErrorMessage name={name} component="div" className="mt-1 text-sm text-red-500" />
    </div>
  );
};

// Validation schema
const ClubVerificationSchema = Yup.object().shape({
  // Club Details
  clubName: Yup.string().required('Club name is required'),
  clubType: Yup.string().required('Club type is required'),
  description: Yup.string()
    .max(300, 'Description must be 300 characters or less')
    .required('Description is required'),
  affiliation: Yup.string().required('University/Organization is required'),

  // Primary Contact
  contactName: Yup.string().required('Contact name is required'),
  contactEmail: Yup.string()
    .email('Invalid email address')
    .required('Contact email is required'),
  contactPhone: Yup.string()
    .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits')
    .required('Contact phone is required'),
  contactPosition: Yup.string().required('Position is required'),
  
  // Documentation
  approvalLetter: Yup.mixed().required('Approval letter is required'),
  
  // Planned Activities
  upcomingEvent1: Yup.string().required('At least one upcoming event is required'),
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
  const [verificationStatus, setVerificationStatus] = useState<'PENDING' | 'APPROVED' | 'REJECTED'>('PENDING');

  const initialValues: ClubVerificationFormValues = {
    clubName: '',
    clubType: '',
    description: '',
    affiliation: '',
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Club Verification
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Complete this form to register and verify your club on ClubSync
          </p>
          <div className="flex justify-center">
            <StatusBadge status={verificationStatus} />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
          <Formik
            initialValues={initialValues}
            validationSchema={ClubVerificationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, isSubmitting, setFieldValue }: { 
              errors: any; 
              touched: any; 
              isSubmitting: boolean; 
              setFieldValue: (field: string, value: any) => void 
            }) => (
              <Form className="space-y-8">
                {/* Section 1: Club Details */}
                <div>
                  <h2 className="text-xl font-semibold text-violet-700 mb-4 pb-2 border-b border-gray-200">
                    Club Details
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-1">
                      <label htmlFor="clubName" className="block text-sm font-medium text-gray-700 mb-1">
                        Club Name <span className="text-red-500">*</span>
                      </label>
                      <Field
                        type="text"
                        name="clubName"
                        id="clubName"
                        className={`w-full px-3 py-2 border ${
                          errors.clubName && touched.clubName
                            ? 'border-red-500'
                            : 'border-gray-300'
                        } rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
                      />
                      <ErrorMessage name="clubName" component="div" className="mt-1 text-sm text-red-500" />
                    </div>

                    <div className="col-span-1">
                      <label htmlFor="clubType" className="block text-sm font-medium text-gray-700 mb-1">
                        Club Type <span className="text-red-500">*</span>
                      </label>
                      <Field
                        as="select"
                        name="clubType"
                        id="clubType"
                        className={`w-full px-3 py-2 border ${
                          errors.clubType && touched.clubType
                            ? 'border-red-500'
                            : 'border-gray-300'
                        } rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
                      >
                        <option value="">Select Club Type</option>
                        {clubTypes.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </Field>
                      <ErrorMessage name="clubType" component="div" className="mt-1 text-sm text-red-500" />
                    </div>

                    <div className="col-span-1 md:col-span-2">
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                        Description <span className="text-red-500">*</span>
                        <span className="ml-1 text-xs text-gray-500">(Max 300 characters)</span>
                      </label>
                      <Field
                        as="textarea"
                        name="description"
                        id="description"
                        rows={3}
                        maxLength={300}
                        className={`w-full px-3 py-2 border ${
                          errors.description && touched.description
                            ? 'border-red-500'
                            : 'border-gray-300'
                        } rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
                      />
                      <div className="mt-1 flex justify-between">
                        <ErrorMessage name="description" component="div" className="text-sm text-red-500" />
                        <Field name="description">
                          {({ field }: { field: any }) => (
                            <span className="text-xs text-gray-500">
                              {field.value.length}/300
                            </span>
                          )}
                        </Field>
                      </div>
                    </div>

                    <div className="col-span-1 md:col-span-2">
                      <label htmlFor="affiliation" className="block text-sm font-medium text-gray-700 mb-1">
                        University/Organization Affiliation <span className="text-red-500">*</span>
                      </label>
                      <Field
                        type="text"
                        name="affiliation"
                        id="affiliation"
                        className={`w-full px-3 py-2 border ${
                          errors.affiliation && touched.affiliation
                            ? 'border-red-500'
                            : 'border-gray-300'
                        } rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
                      />
                      <ErrorMessage name="affiliation" component="div" className="mt-1 text-sm text-red-500" />
                    </div>
                  </div>
                </div>

                {/* Section 2: Primary Contact */}
                <div>
                  <h2 className="text-xl font-semibold text-violet-700 mb-4 pb-2 border-b border-gray-200">
                    Primary Contact
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-1">
                      <label htmlFor="contactName" className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <Field
                        type="text"
                        name="contactName"
                        id="contactName"
                        className={`w-full px-3 py-2 border ${
                          errors.contactName && touched.contactName
                            ? 'border-red-500'
                            : 'border-gray-300'
                        } rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
                      />
                      <ErrorMessage name="contactName" component="div" className="mt-1 text-sm text-red-500" />
                    </div>

                    <div className="col-span-1">
                      <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-1">
                        University Email <span className="text-red-500">*</span>
                      </label>
                      <Field
                        type="email"
                        name="contactEmail"
                        id="contactEmail"
                        className={`w-full px-3 py-2 border ${
                          errors.contactEmail && touched.contactEmail
                            ? 'border-red-500'
                            : 'border-gray-300'
                        } rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
                      />
                      <ErrorMessage name="contactEmail" component="div" className="mt-1 text-sm text-red-500" />
                    </div>

                    <div className="col-span-1">
                      <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <Field
                        type="tel"
                        name="contactPhone"
                        id="contactPhone"
                        className={`w-full px-3 py-2 border ${
                          errors.contactPhone && touched.contactPhone
                            ? 'border-red-500'
                            : 'border-gray-300'
                        } rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
                      />
                      <ErrorMessage name="contactPhone" component="div" className="mt-1 text-sm text-red-500" />
                    </div>

                    <div className="col-span-1">
                      <label htmlFor="contactPosition" className="block text-sm font-medium text-gray-700 mb-1">
                        Designation / Position <span className="text-red-500">*</span>
                      </label>
                      <Field
                        type="text"
                        name="contactPosition"
                        id="contactPosition"
                        className={`w-full px-3 py-2 border ${
                          errors.contactPosition && touched.contactPosition
                            ? 'border-red-500'
                            : 'border-gray-300'
                        } rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
                      />
                      <ErrorMessage name="contactPosition" component="div" className="mt-1 text-sm text-red-500" />
                    </div>

                    <div className="col-span-1 md:col-span-2">
                      <FileUpload
                        name="contactIdProof"
                        label="Upload ID Proof (PDF/Image)"
                        accept=".pdf,.jpg,.jpeg,.png"
                        required={true}
                        setFieldValue={setFieldValue}
                      />
                    </div>
                  </div>
                </div>

                {/* Section 3: Documentation Upload */}
                <div>
                  <h2 className="text-xl font-semibold text-violet-700 mb-4 pb-2 border-b border-gray-200">
                    Documentation Upload
                  </h2>
                  <div className="space-y-4">
                    <FileUpload
                      name="clubConstitution"
                      label="Club Constitution (PDF/DOCX)"
                      accept=".pdf,.docx"
                      setFieldValue={setFieldValue}
                    />

                    <FileUpload
                      name="approvalLetter"
                      label="Official Approval Letter"
                      accept=".pdf,.docx,.jpg,.jpeg,.png"
                      required={true}
                      setFieldValue={setFieldValue}
                    />

                    <FileUpload
                      name="meetingMinutes"
                      label="Recent Meeting Minutes"
                      accept=".pdf,.docx"
                      setFieldValue={setFieldValue}
                    />

                    <FileUpload
                      name="clubLogo"
                      label="Club Logo"
                      accept=".jpg,.jpeg,.png,.svg"
                      setFieldValue={setFieldValue}
                    />
                  </div>
                </div>

                {/* Section 4: Planned Activities */}
                <div>
                  <h2 className="text-xl font-semibold text-violet-700 mb-4 pb-2 border-b border-gray-200">
                    Planned Activities
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-1">
                      <label htmlFor="upcomingEvent1" className="block text-sm font-medium text-gray-700 mb-1">
                        Upcoming Event 1 <span className="text-red-500">*</span>
                      </label>
                      <Field
                        type="text"
                        name="upcomingEvent1"
                        id="upcomingEvent1"
                        placeholder="Event name & brief description"
                        className={`w-full px-3 py-2 border ${
                          errors.upcomingEvent1 && touched.upcomingEvent1
                            ? 'border-red-500'
                            : 'border-gray-300'
                        } rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
                      />
                      <ErrorMessage name="upcomingEvent1" component="div" className="mt-1 text-sm text-red-500" />
                    </div>

                    <div className="col-span-1">
                      <label htmlFor="upcomingEvent2" className="block text-sm font-medium text-gray-700 mb-1">
                        Upcoming Event 2
                      </label>
                      <Field
                        type="text"
                        name="upcomingEvent2"
                        id="upcomingEvent2"
                        placeholder="Event name & brief description"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>

                    <div className="col-span-1">
                      <label htmlFor="expectedMembers" className="block text-sm font-medium text-gray-700 mb-1">
                        Expected Number of Members <span className="text-red-500">*</span>
                      </label>
                      <Field
                        type="number"
                        name="expectedMembers"
                        id="expectedMembers"
                        min="1"
                        className={`w-full px-3 py-2 border ${
                          errors.expectedMembers && touched.expectedMembers
                            ? 'border-red-500'
                            : 'border-gray-300'
                        } rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500`}
                      />
                      <ErrorMessage name="expectedMembers" component="div" className="mt-1 text-sm text-red-500" />
                    </div>

                    <div className="col-span-1 md:col-span-2">
                      <span className="block text-sm font-medium text-gray-700 mb-2">
                        Focus Areas <span className="text-red-500">*</span>
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {focusAreas.map((area) => (
                          <div key={area.id} className="flex items-center">
                            <Field
                              type="checkbox"
                              name="focusAreas"
                              id={`focusArea-${area.id}`}
                              value={area.id}
                              className="h-4 w-4 text-orange-500 rounded border-gray-300 focus:ring-orange-500"
                            />
                            <label
                              htmlFor={`focusArea-${area.id}`}
                              className="ml-2 block text-sm text-gray-700"
                            >
                              {area.label}
                            </label>
                          </div>
                        ))}
                      </div>
                      <ErrorMessage name="focusAreas" component="div" className="mt-1 text-sm text-red-500" />
                    </div>
                  </div>
                </div>

                {/* Section 5: Agreements */}
                <div>
                  <h2 className="text-xl font-semibold text-violet-700 mb-4 pb-2 border-b border-gray-200">
                    Agreements
                  </h2>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <Field
                          type="checkbox"
                          name="isOfficialRepresentative"
                          id="isOfficialRepresentative"
                          className="h-4 w-4 text-orange-500 rounded border-gray-300 focus:ring-orange-500"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="isOfficialRepresentative" className="text-gray-700">
                          I confirm that I am an official representative of this club <span className="text-red-500">*</span>
                        </label>
                        <ErrorMessage name="isOfficialRepresentative" component="div" className="mt-1 text-sm text-red-500" />
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <Field
                          type="checkbox"
                          name="documentsVerified"
                          id="documentsVerified"
                          className="h-4 w-4 text-orange-500 rounded border-gray-300 focus:ring-orange-500"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="documentsVerified" className="text-gray-700">
                          All documents are verified by the university/organization <span className="text-red-500">*</span>
                        </label>
                        <ErrorMessage name="documentsVerified" component="div" className="mt-1 text-sm text-red-500" />
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <Field
                          type="checkbox"
                          name="agreeToTerms"
                          id="agreeToTerms"
                          className="h-4 w-4 text-orange-500 rounded border-gray-300 focus:ring-orange-500"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="agreeToTerms" className="text-gray-700">
                          I agree to the platform's{' '}
                          <a href="#" className="text-orange-500 hover:underline">
                            Terms & Conditions
                          </a>{' '}
                          <span className="text-red-500">*</span>
                        </label>
                        <ErrorMessage name="agreeToTerms" component="div" className="mt-1 text-sm text-red-500" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl font-medium hover:from-orange-600 hover:to-red-600 transition-all duration-300 flex items-center justify-center ${
                      isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      'Submit Club Verification'
                    )}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}
