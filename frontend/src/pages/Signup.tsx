import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Signup() {
  return (
    <div className="h-screen w-full bg-gray-200 flex items-center justify-center">
      <div className="bg-white  rounded-xl border  min-w-48 space-y-4 text-center p-20">
        <Input placeholder="Username" type="username" />
        <Input placeholder="Password" type="password" />

        <div className="flex justify-center pt-4">
          <Button>Signup</Button>
        </div>
      </div>
    </div>
  );
}
