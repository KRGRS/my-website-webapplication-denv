import { CanvasProvider } from "../components/cncFrame/canvasProvider"

export class saveClass {
    /**
     * 
     * @param {CanvasProvider} obj 
     */
    constructor(obj) {

        this.circles = [];
        this.lines = [];
        this.rectangle = [];
        this.outline = [];


        obj.objOnCanvas.forEach((item) => {
            switch (item.constructor.name) {
                case 'Circle':
                    this.circles.push({
                        'points': item.points,
                        'radPoint': item.radPoint,
                        'angle': item.rotationAngle
                    });
                    break;

                case 'Line':
                    this.lines.push({
                        'points': item.points
                    });
                    break;

                case 'Rectangle':
                    this.rectangle.push({
                        'points': item.points,
                        'angle': item.rotationAngle
                    });
                    break;

                case 'Outline':
                    this.outline.push({
                        'points': item.points
                    });

                    break;

                default:
                    console.log("Grid"); 
                    break;
            }
        }); 
    }
}