interface InputProps{
  placeholder:string,
  refrence?:any
}

export default function Input({placeholder,refrence}:InputProps) {
  return (
    <div>
      <input 
      ref={refrence}
      placeholder={placeholder}
      type={"text"}
     className="px-4 py-2 rounded-md m-2 border-2" 
      />
    </div>
  )
}