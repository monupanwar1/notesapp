interface InputProps {
  placeholder: string;
  reference?: any;
}

export default function Input({ placeholder, reference }: InputProps) {
  return (
    <div>
      <input
        ref={reference}
        placeholder={placeholder}
        type={'text'}
        className="px-4 py-2 rounded-md m-2 border-2"
      />
    </div>
  );
}