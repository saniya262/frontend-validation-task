import React, { useState } from 'react';
import './App.css';

const App = () => {
  const [formFields, setFormFields] = useState([]);
  const [selectedForm, setSelectedForm] = useState('');
  const [formData, setFormData] = useState({});
  const [submittedData, setSubmittedData] = useState({
    'User Information': [],
    'Address Information': [],
    'Payment Information': [],
  });
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('');
  const [formVisible, setFormVisible] = useState(true);
  const [editingId, setEditingId] = useState(null);

  const formOptions = {
    'User Information': {
      fields: [
        { name: 'firstName', type: 'text', label: 'First Name', required: true },
        { name: 'lastName', type: 'text', label: 'Last Name', required: true },
        { name: 'age', type: 'number', label: 'Age', required: false },
      ],
    },
    'Address Information': {
      fields: [
        { name: 'street', type: 'text', label: 'Street', required: true },
        { name: 'city', type: 'text', label: 'City', required: true },
        { name: 'state', type: 'dropdown', label: 'State', options: ['Kerala', 'TamilNadu', 'Karnataka', 'Goa', 'Other'], required: true },
        { name: 'zipCode', type: 'number', label: 'Pin code', required: true },
      ],
    },
    'Payment Information': {
      fields: [
        { name: 'cardNumber', type: 'number', label: 'Card Number', required: true },
        { name: 'expiryDate', type: 'date', label: 'Expiry Date', required: true },
        { name: 'cvv', type: 'password', label: 'CVV', required: true },
        { name: 'cardholderName', type: 'text', label: 'Cardholder Name', required: true },
      ],
    },
  };

  const handleFormSelection = (e) => {
    const selected = e.target.value;
    setSelectedForm(selected);
    setFormFields(formOptions[selected]?.fields || []);
    setFormData({});
    setProgress(0);
    setMessage('');
    setEditingId(null);
  };

  const handleChange = (field, value) => {
    const updatedFormData = { ...formData, [field]: value };
    setFormData(updatedFormData);

    const totalFields = formFields.length;
    const filledFields = formFields.filter(
      (f) => updatedFormData[f.name] && (f.required || updatedFormData[f.name].trim() !== '')
    ).length;

    setProgress((filledFields / totalFields) * 100);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formFields.some((f) => f.required && !formData[f.name])) {
      setMessage('Please fill out all required fields.');
      return;
    }

    const formType = selectedForm;

    if (editingId) {
      const updatedData = submittedData[formType].map((data) =>
        data.id === editingId ? { ...formData, id: editingId } : data
      );
      setSubmittedData({
        ...submittedData,
        [formType]: updatedData,
      });
    } else {
      setSubmittedData({
        ...submittedData,
        [formType]: [...submittedData[formType], { ...formData, id: Date.now() }], 
      });
      setMessage('Form submitted successfully!');
    }

    setFormData({});
    setProgress(0);
    setFormVisible(false);
    setEditingId(null);
  };

  const handleEdit = (id, formType) => {
    const dataToEdit = submittedData[formType].find((data) => data.id === id);
    setFormData(dataToEdit);
    setEditingId(id);
    setFormVisible(true);
  };

  const handleDelete = (id, formType) => {
    setSubmittedData({
      ...submittedData,
      [formType]: submittedData[formType].filter((data) => data.id !== id),
    });
    setMessage('Entry deleted successfully!');
  };

  const handleGoBack = () => {
    setFormVisible(true);
    setFormData({});
    setEditingId(null);
    setMessage('');
  };

  const renderTable = (formType) => {
    return (
      <div className="submitted-data-section mt-5 ">
        <h3 className="mt-4 mb-3" style={{ color: "#E08600" }}>{formType}</h3>
        <table className="table table-bordered">
          <thead>
            <tr>
              {formOptions[formType].fields.map((field) => (
                <th key={field.name}>{field.label}</th>
              ))}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {submittedData[formType].map((data) => (
              <tr key={data.id}>
                {formOptions[formType].fields.map((field) => (
                  <td key={field.name}>{data[field.name]}</td>
                ))}
                <td>
                  <button
                    className="btn btn-warning me-2"
                    onClick={() => handleEdit(data.id, formType)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(data.id, formType)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="container mt-4 form-container w-50">
      <h1 className="text-center">
        <span style={{ color: "#763A12" }}>User</span>
        <span style={{ color: "#E08600" }}> Form</span>
      </h1>

      {formVisible && (
        <div className="form-section">
          <div className="form-group">
            <label className='ms-2' style={{ color: "#AA4C0A", fontSize: "15px" }}>Select Form Type</label>
            <select className="form-control mt-2" style={{ color: "#763A12" }} onChange={handleFormSelection}>
              <option value="">-- Select --</option>
              {Object.keys(formOptions).map((key) => (
                <option key={key} value={key}>
                  {key}
                </option>
              ))}
            </select>
          </div>

          {formFields.length > 0 && (
            <form onSubmit={handleSubmit}>
              {formFields.map((field) => (
                <div key={field.name} className="form-group">
                  {field.type === 'dropdown' ? (
                    <select
                      style={{ color: "#763A12" }}
                      className="form-control mt-4"
                      value={formData[field.name] || ''}
                      onChange={(e) => handleChange(field.name, e.target.value)}
                      required={field.required}
                    >
                      <option value="">State</option>
                      {field.options.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type}
                      className="form-control mt-4"
                      value={formData[field.name] || ''}
                      onChange={(e) => handleChange(field.name, e.target.value)}
                      placeholder={field.label}
                      required={field.required}
                      style={{ color: "#763A12" }}
                    />
                  )}
                </div>
              ))}

              <div className="progress my-3">
                <div
                  className="progress-bar bg-success"
                  role="progressbar"
                  style={{ width: `${progress}%` }}
                  aria-valuenow={progress}
                  aria-valuemin="0"
                  aria-valuemax="100"
                ></div>
              </div>

              <button type="submit" className="btn w-25" style={{ backgroundColor: '#E08600', color: 'white' }}>
                {editingId ? 'Update' : 'Submit'}
              </button>
            </form>
          )}

          {editingId === null && message && (
            <div className="alert alert-info mt-3 mb-5">{message}</div>
          )}
        </div>
      )}

      {/* Render Submitted Data Tables */}
      {!formVisible && (
        <>
          {submittedData['User Information'].length > 0 && renderTable('User Information')}
          {submittedData['Address Information'].length > 0 && renderTable('Address Information')}
          {submittedData['Payment Information'].length > 0 && renderTable('Payment Information')}
          <button onClick={handleGoBack} className="btn w-25 mt-4" style={{ backgroundColor: '#AA4C0A', color: 'white' }}>
            Go Back
          </button>
        </>
      )}
    </div>
  );
};

export default App;
