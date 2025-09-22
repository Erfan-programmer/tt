import React from "react";
import RankBox from "./RankBox/RankBox";

export default function RankBoxSection() {
  return (
    <div className="space-y-4">
      <RankBox
        title="🥇 Honor Badge – Gold Rank"
        src="/gold.png"
        description={`Congratulations!<br/> <span> With unwavering dedication, discipline, and perseverance, you have successfully completed the Team Builders Tournament and reached the prestigious Gold Rank.
        Throughout this journey, you not only earned valuable rewards, but more importantly, you built a strong and reliable team—the foundation of your future success.
        We admire your commitment and are proud to have walked this path with you.</span>`}
        footer={`<span>✨ In the end, you’ll see that the greatest reward is having a powerful, united team by your side</span> <br/> <span>🎖️ You’ve earned this honor.<br/>And we’ll always be here with you.</span>`}
      />
      <RankBox
        title="🥈 Honor Badge – Silver Rank"
        src="/silver.png"
        description="Well done!<br/> Through consistent effort, structure, and unwavering commitment, you've advanced to the Silver Rank in the Team Builders Tournament.
        This achievement is a reflection of your growing leadership and your progress in building a high-performing team."
        footer={`<span>You are becoming the kind of leader others rely on and rally behind.</span> <br/>
         <span>✨ Now is the time to push forward and aim for the Gold.</span>
        </span> <br/> <span>🎖️ We are honored to grow alongside you.</span>`}
      />
      <RankBox
        title="🥉 Honor Badge – Bronze Rank"
        src="/bronze.png"
        description=" Congratulations! <br/>  You've taken your first strong and determined step by reaching the Bronze Rank in the Team Builders Tournament.
        This milestone reflects your commitment to growth and your will to build a powerful future team. We recognize your effort and look forward to your progress through the next stages"
        footer={`<span>✨ Stay focused—the path to success has just begun.</span> <br/>
         <span>🎖️ We're proud to be with you on this journey.</span>`}
      />
    </div>
  );
}
