import { useState } from "react";

export default function PetitionCommentSection() {
  return (
    <div className="mt-[1rem]">
      <PetitionBlockExpandedForm />
      <div className="flex flex-col gap-[1rem] w-full mt-[2rem]">
        {Array.from({ length: 3 }).map((_a, i) => (
          <div key={i} className="flex flex-col gap-[.5rem] border-border border-[1px] p-[.5rem] rounded-md">
            <div className="self-end flex gap-[.5rem] items-center">
              <h4 className="text-text-muted">Abuda Maji</h4>
              <div className="w-[3.5rem] h-[3.5rem] rounded-full animate-pulse bg-active"></div>
            </div>
            <p className="text-right text-text-muted">
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nam nobis placeat, sapiente id cupiditate
              dolores. Quia maiores non voluptatibus in rerum unde itaque iusto excepturi distinctio nulla quod pariatur
              minus explicabo amet quas earum praesentium laudantium, beatae rem esse. Sed odio quam repellat explicabo
              voluptatem animi molestias porro, exercitationem soluta!
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function PetitionBlockExpandedForm() {
  const [value, setValue] = useState("");
  return (
    <form onSubmit={(e) => e.preventDefault()} className="w-full">
      <h3 className="text-[1.8rem] mb-[1rem] w-full text-text-muted">Комментарии</h3>
      <div className="flex gap-[.5rem]">
        <input
          type="text"
          name="comment"
          id="Comment"
          value={value}
          placeholder="I DON'T LIKE IT"
          onChange={(e) => setValue(e.target.value)}
          className="bg-inherit border-[.1rem] border-border rounded-md w-full px-[1rem] py-[.5rem] text-[1.4rem]"
        />
        <button className="px-[1rem] py-[.5rem] rounded-md shadow-sm shadow-text-muted active:scale-[0.98] hover:scale-[1.01]">
          Gaaa
        </button>
      </div>
    </form>
  );
}
