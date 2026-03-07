import "./Buttons.css"
import { Heart, Share2, EyeOff, MoreVertical} from "lucide-react";

export default function Buttons() {
	return (
		<div className="container-buttons">
                <button className="job-apply">Aplicar</button>
                <div className="buttons">
                    <button className="button-icon" onClick={() => setInterval}>
                        <Heart className="text-blue-600 w-6 h-6"></Heart>
                    </button>
                    <button className="button-icon">
                        <Share2 className="text-blue-600 w-6 h-6"></Share2>
                    </button>
                    <button className="button-icon">
                        <EyeOff className="text-blue-600 w-6 h-6" />
                    </button>
                    <button className="button-icon">
                        <MoreVertical className="text-blue-600 w-6 h-6" />
                    </button>
                </div>
        </div>
    );
}

