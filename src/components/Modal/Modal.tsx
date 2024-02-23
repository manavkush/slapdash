import { Button } from "@/src/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { useRef } from "react"
import { toast } from "react-toastify"

export function AddNewChatModal() {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleNewChannelClick = async () => {

    if (inputRef.current?.value === "") {
      return {
        error: "Please enter a channel name",
      }
    }

    const response = await fetch("/api/channel/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ channelName: "test" }),
    })

    const data = await response.json()

    if (data.error) {
      toast.error(data.error)
    }
  }


  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-stone-800 rounded-none text-lg hover:bg-stone-900">Add Channel</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Channel</DialogTitle>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="channelName" className="sr-only">
              Channel Name
            </Label>
            <Input
              id="channelName"
              defaultValue=""
              ref={inputRef}
            />
          </div>

        </div>
        <DialogFooter className="sm:justify-start">
          <Button type="button" variant="default" className="px-8" onClick={handleNewChannelClick}>
            Add
          </Button>
          <DialogClose>
            <Button type="button" variant="secondary" className="mx-2 text-white bg-stone-900">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
