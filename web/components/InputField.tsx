import { FormControl, FormErrorMessage, FormLabel, Input, Textarea } from "@chakra-ui/react";
import { useField } from "formik";

type InputFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
    name: string;
    label: string;
    textarea?: boolean;
};

const InputField: React.FC<InputFieldProps> = ({ textarea, size, ...props }) => {

  let InputOrTextarea = Input;
  if(textarea) {
    InputOrTextarea = Textarea;
  }

  const [field, { error }] = useField(props);

  return (
    //   isInvalid takes boolean value
    //   '' => false
    //   'an error mssg' => true
    <FormControl isInvalid={!!error}>
      <FormLabel mt={4}>{props.label}</FormLabel>
      <InputOrTextarea {...field} {...props} id={field.name} />
      <FormErrorMessage>{error}</FormErrorMessage>
    </FormControl>
  );
};

export default InputField;
