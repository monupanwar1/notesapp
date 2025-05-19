
import { CrossIcon } from '../icons/CrossIcon'; 
import { Button } from './Button'; //n

import Input from './input';

// Enum to represent different types of content
// enum ContentType{
//   Youtube = 'youtube',
//   Twitter = 'twitter',
// }

// Interface for the props passed to the CreateContentModal component
interface CreateContentModalProps {
  open: boolean; // State to determine if the modal is open
  onClose: () => void; // Function to close the modal
}

// CreateContentModal component definition
export function CreateContentModal({ open, onClose }: CreateContentModalProps) {

  return (
    <div>
      {open && (
        // Modal background overlay
        <div>
          <div className="w-screen h-screen bg-slate-500 fixed top-0 left-0 opacity-60 flex justify-center"></div>
          {/* Modal content container */}
          <div className="w-screen h-screen fixed top-0 left-0 flex justify-center">
            <div className="flex flex-col justify-center">
              <span className="bg-white opacity-100 p-4 rounded fixed">
                {/* Close button */}
                <div className="flex justify-end">
                  <div onClick={onClose} className="cursor-pointer">
                    <CrossIcon />
                  </div>
                </div>
                {/* Input fields for title and link */}
                <div>
                  <Input placeholder="Title" />
                  <Input placeholder="Link" />
                </div>
                {/* Content type selection */}
                <div>
                  <h1>Type</h1>
                  <div className="flex gap-1 justify-center pb-2">
                    {/* Button to select YouTube type */}
                    <Button
                      text="Youtube"
                      variant={
                        type === ContentType.Youtube ? 'primary' : 'secondary'
                      }
                      onClick={}
                    />
                    {/* Button to select Twitter type */}
                    <Button text="Twitter" variant="primary" />
                  </div>
                </div>
                {/* Submit button */}
                <div className="flex justify-center">
                  <Button variant="primary" text="Submit" />
                </div>
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
