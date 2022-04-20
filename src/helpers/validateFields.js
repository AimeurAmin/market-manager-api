const validateFields = (allowedFields, requiredFields, body) => {
  const bodyFields = Object.keys(body);

  const invalidFields = bodyFields.filter(
    (field) => !allowedFields.includes(field)
  );

  const missingFields = requiredFields.filter((field) => !bodyFields.includes(field))

  return {
    invalidFields,
    missingFields
  };
};

export default validateFields;
