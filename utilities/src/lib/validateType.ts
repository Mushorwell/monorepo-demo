/**
 * Options for validating properties.
 * @typedef {Object} ValidateOptions
 * @property {string[]} checkPropNames - An array of property names to check in the value.
 */
export type ValidateOptions = {
  checkPropNames: string[];
};

/**
 * Validates the type of a value against specified options.
 * @template T
 * @param {T} val - The value to validate.
 * @param {ValidateOptions} options - The options containing property names to check.
 * @returns {val is T} - Returns true if the value is valid according to the options.
 */
export function validateType<T extends object>(
  val: T,
  options: ValidateOptions
): val is T {

  /**
   * Checks if a property name exists in the value.
   * @template T
   * @param {T} value - The value to check.
   * @param {string} propertyName - The property name to check for.
   * @returns {value is T} - Returns true if the property exists in the value.
   */
  const validatePropertyInValue = <T extends object>(
    value: T,
    propertyName: string
  ): value is T => propertyName in value;

  /**
   * Validates the type of a property in the value.
   * @template T
   * @param {T} value - The value containing the property.
   * @param {string} propertyName - The property name to validate.
   * @returns {value is T} - Returns true if the property is valid.
   */
  const validateValuePropertyType = <T extends object>(
  value: T,
  propertyName: string
): value is T => {
  const validateProperty = (obj: object) => {
    type TObjectWithProperty = {
      [propertyName: string]: unknown
    }
    const propertyValue = (obj as TObjectWithProperty)[propertyName];
    return Object.prototype.hasOwnProperty.call(obj, propertyName) &&
      (typeof propertyValue === 'object' ?
        (Array.isArray(propertyValue) ?
          propertyValue.length > 0 :
          !!propertyValue && Object.keys(propertyValue).length > 0) :
        !!propertyValue);
  };

  if (Array.isArray(value)) {
    return value.every(validateProperty);
  }
  return validateProperty(value);
};

  return options.checkPropNames.every((propName: string) => {
    if (Array.isArray(val)) {
      return validateValuePropertyType(val, propName);
    }
    if (typeof val === 'object') {
      return (
        validatePropertyInValue(val, propName) &&
        validateValuePropertyType(val, propName)
      );
    }
    return !!val;
  });
}