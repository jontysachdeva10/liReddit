import { FormControl, FormErrorMessage, FormLabel, Input } from "@chakra-ui/react";
import { useField } from "formik";

type InputFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
    name: string;
    label: string;
    placeholder: string;
};

const InputField: React.FC<InputFieldProps> = ({ size, ...props }) => {
  const [field, { error }] = useField(props);

  return (
    //   isInvalid takes boolean value
    //   '' => false
    //   'an error mssg' => true
    <FormControl isInvalid={!!error}>
      <FormLabel>{props.label}</FormLabel>
      <Input {...field} {...props} id={field.name} placeholder={props.placeholder} />
      <FormErrorMessage>{error}</FormErrorMessage>
    </FormControl>
  );
};

export default InputField;
