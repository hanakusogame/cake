import { MainScene } from "./MainScene";
declare function require(x: string): any;

//メインのゲーム画面
export class MainGame extends g.E {
	public reset: () => void;
	public setMode: (num: number) => void;

	constructor(scene: MainScene) {
		const tl = require("@akashic-extension/akashic-timeline");
		const timeline = new tl.Timeline(scene);
		const sizeW = 640;
		const sizeH = 360;
		super({ scene: scene, x: 0, y: 0, width: sizeW, height: sizeH, touchable: true });

		const base = new g.E({
			scene: scene,
			x: 0, y: 0,
			width: 640,
			height: 360,
			touchable: true
		});
		this.append(base);

		//背景
		const bg = new g.FilledRect({
			scene: scene,
			width: 640,
			height: 360,
			cssColor: "#CCCCCC",
			opacity: 0.9
		});
		base.append(bg);

		//影
		const shadow = new g.Sprite({
			scene: scene,
			src: scene.assets["shadow"],
			x: 0, y: 170,
			scaleX: 0.8
		});
		base.append(shadow);

		//ケーキ本体
		const rects: g.Pane[] = [];
		for (let i = 0; i < 7; i++) {
			const rect = new g.Pane({
				scene: scene,
				x: 95,
				y: 80,
				width: 450,
				height: 200
			});
			base.append(rect);
			rect.hide();
			rects.push(rect);

			const spr = new g.Sprite({
				scene: scene,
				src: scene.assets["cake"]
			});

			rect.append(spr);
		}

		//補助線
		const line = new g.FilledRect({
			scene: scene,
			x: 200,
			y: 70,
			width: 3,
			height: 220,
			cssColor: "red"
		});
		base.append(line);

		//フォント
		const glyph = JSON.parse((scene.assets["glyph72"] as g.TextAsset).data);
		const numFontB = new g.BitmapFont({
			src: scene.assets["number_b"],
			map: glyph.map,
			defaultGlyphWidth: 72,
			defaultGlyphHeight: 80
		});

		const numFontY = new g.BitmapFont({
			src: scene.assets["number_y"],
			map: glyph.map,
			defaultGlyphWidth: 72,
			defaultGlyphHeight: 80
		});

		const numFontP = new g.BitmapFont({
			src: scene.assets["number_p"],
			map: glyph.map,
			defaultGlyphWidth: 65,
			defaultGlyphHeight: 80
		});

		//残り時間表示用
		const sprTime = new g.Sprite({
			scene: scene,
			src: scene.assets["score"],
			width: 50,
			height: 32,
			x: 20,
			y: 40,
			srcY: 64
		});
		base.append(sprTime);

		const sprTime2 = new g.Sprite({
			scene: scene,
			src: scene.assets["score"],
			width: 50,
			height: 32,
			x: 110,
			y: 10,
			srcX: 50,
			srcY: 64
		});
		sprTime.append(sprTime2);

		const labelTime = new g.Label({
			scene: scene,
			font: numFontP,
			fontSize: 54,
			text: "7",
			x: 60,
			y: -4
		});
		sprTime.append(labelTime);

		let time = 0;
		labelTime.update.add(() => {
			if (!scene.isStart || isStop) return;
			time++;
			const t = (5 + stageNum) - Math.floor(time / 30);
			if (t < 0) {
				result();
			} else {
				labelTime.text = "" + t;
				labelTime.invalidate();
			}
		});

		//分割数表記用
		const labelSprit = new g.Label({
			scene: scene,
			font: numFontB,
			fontSize: 54,
			text: "1",
			x: 270,
			y: 36
		});
		base.append(labelSprit);

		const sprSprit = new g.Sprite({
			scene: scene,
			src: scene.assets["select"],
			width: 80,
			height: 50,
			x: 50,
			y: 4
		});
		labelSprit.append(sprSprit);

		//誤差表記用
		const sprDiff = new g.Sprite({
			scene: scene,
			src: scene.assets["select"],
			width: 80,
			height: 50,
			x: 100,
			y: 36,
			srcX: 80
		});
		base.append(sprDiff);

		const labelDiff = new g.Label({
			scene: scene,
			font: numFontP,
			fontSize: 45,
			text: "00.0C",
			x: 80,
			y: 3
		});
		sprDiff.append(labelDiff);

		const labelDiff2 = new g.Label({
			scene: scene,
			font: scene.numFont,
			fontSize: 24,
			text: "(00.00%)",
			x: 240,
			y: 20
		});
		sprDiff.append(labelDiff2);

		//分割数が違う場合のメッセージ
		const sprMiss = new g.Sprite({
			scene: scene,
			src: scene.assets["miss"],
			x: 200,
			y: 45
		});
		base.append(sprMiss);

		//スコア表示用
		const labelScore = new g.Label({
			scene: scene,
			font: numFontY,
			fontSize: 54,
			text: "+10000C",
			x: 95,
			y: 100,
			width: 450,
			textAlign: g.TextAlign.Center, widthAutoAdjust: false
		});
		base.append(labelScore);

		//分割後の大きさ表記用
		const labelSizes: g.Label[] = [];
		for (let i = 0; i < 7; i++) {
			const label = new g.Label({
				scene: scene,
				font: scene.numFont,
				fontSize: 24,
				text: "100",
				x: 0,
				y: 290
			});
			labelSizes.push(label);
			base.append(label);
			label.hide();
		}

		//最小ラベル
		const sprMin = new g.Sprite({
			scene: scene,
			src: scene.assets["select"],
			width: 80,
			height: 50,
			x: 0,
			y: 310,
			srcX: 0,
			srcY: 50,
			scaleX: 0.8,
			scaleY: 0.8
		});
		base.append(sprMin);

		//最大ラベル
		const sprMax = new g.Sprite({
			scene: scene,
			src: scene.assets["select"],
			width: 80,
			height: 50,
			x: 80,
			y: 310,
			srcX: 80,
			srcY: 50,
			scaleX: 0.8,
			scaleY: 0.8
		});
		base.append(sprMax);

		//完成ボタン
		const btnComp = new g.FrameSprite({
			scene: scene,
			src: scene.assets["comp"] as g.ImageAsset,
			width: 160,
			height: 80,
			x: 475,
			y: 275,
			frames: [0, 1],
			touchable: true
		});
		//base.append(btnComp);

		btnComp.pointDown.add(() => {
			if (!scene.isStart || isStop) return;
			btnComp.frameNumber = 1;
			btnComp.modified();
		});

		btnComp.pointUp.add(() => {
			if (!scene.isStart || isStop) return;
			btnComp.frameNumber = 0;
			btnComp.modified();
			btnComp.hide();
			result();
			scene.playSound("se_move");
		});

		let cutNum = 0;
		let spritNum = 0;
		let typeNum = 0;
		let stageNum = 1;
		base.pointDown.add(e => {
			if (!scene.isStart || isStop) return;
			line.x = e.point.x - (line.width / 2);
			line.modified();
		});

		base.pointMove.add(e => {
			if (!scene.isStart || isStop) return;
			line.x = e.point.x + e.startDelta.x - (line.width / 2);
			line.modified();
		});

		base.pointUp.add(e => {
			if (!scene.isStart || isStop) return;
			if (cutNum >= rects.length - 1) return;
			const px = e.point.x + e.startDelta.x;
			line.x = px - (line.width / 2);
			line.modified();
			let isCut = false;
			for (let i = 0; i <= cutNum; i++) {
				const rect = rects[i];
				if (rect.state & 1) break;
				if (rect.x < px && rect.x + rect.width > px) {
					//分割した右側
					const rectRight = rects[cutNum + 1];
					rectRight.x = px;
					rectRight.width = rect.x + rect.width - px;
					const spr = rectRight.children[0] as g.Sprite;
					spr.x = rect.children[0].x + rect.x - px;
					spr.y = -typeNum * 200 - 1;
					rectRight.show();
					rectRight.invalidate();

					//左側は元のスプライトを使う
					rect.width = px - rect.x;
					rect.invalidate();
					cutNum++;
					isCut = true;
					break;
				}
			}

			if (isCut) {
				const random = scene.random.get(10, 20);
				for (let i = 0; i <= cutNum; i++) {
					const rect = rects[i];
					if (rect.x < px) {
						rect.x -= random;
					} else {
						rect.x += random;
					}
					rect.modified();
				}
				shadow.scaleX = 0.8 + (0.05 * cutNum);
				shadow.modified();
				scene.playSound("se_move");
			}

		});

		//結果表示
		const result = () => {
			isStop = true;

			let min = 300;
			let minNum = 0;
			let max = 0;
			let maxNum = 0;
			let score = 0;

			bg.cssColor = "white";
			bg.modified();

			if (cutNum + 1 === spritNum) {
				for (let i = 0; i <= cutNum; i++) {
					const rect = rects[i];
					const label = labelSizes[i];
					label.x = rect.x;
					const size = (rect.width / 450) * 30;
					label.text = "" + (Math.round(size * 10) / 10) + "c";
					label.invalidate();
					timeline.create().wait(i * 300).call(() => {
						label.show();
					});
					if (size <= min) {
						min = size;
						minNum = i;
					}
					if (size > max) {
						max = size;
						maxNum = i;
					}
				}

				//最大・最小表示
				sprMin.show();
				sprMin.x = rects[minNum].x;
				sprMin.modified();

				sprMax.show();
				sprMax.x = rects[maxNum].x;
				sprMax.modified();

				//誤差表示
				labelDiff.text = "" + (Math.round((max - min) * 10) / 10) + "C";
				labelDiff.invalidate();
				labelDiff2.text = "(" + (Math.round((1 - (min / max)) * 100 * 100) / 100) + "%)";
				labelDiff2.invalidate();
				timeline.create(sprDiff).wait(1000).call(() => {
					sprDiff.show();
				});

				score = Math.round(Math.pow((min / max) * 10, 4) * (0.5 * stageNum));
				scene.playSound("se_clear");
			} else {
				sprMiss.show();
				scene.playSound("se_miss");
			}

			//スコアの追加・表示
			labelScore.text = "+" + score + "C";
			labelScore.invalidate();

			timeline.create(labelScore).wait(2000).call(() => {
				labelScore.show();
				scene.addScore(score);
				if (score !== 0) {
					scene.playSound("se_coin");
				}
			});

			labelSprit.hide();
			sprTime.hide();

			line.hide();

			btnComp.hide();

			if (stageNum === 5) return;

			timeline.create().wait(5000).call(() => {
				next();
				scene.playSound("se_select");
			});
		};

		//次のステージ
		const next = () => {
			cutNum = 0;
			typeNum = scene.random.get(0, 5);
			spritNum++;
			stageNum++;

			bg.cssColor = "#CCCCCC";
			bg.modified();

			shadow.scaleX = 0.8;
			shadow.modified();

			for (let i = 0; i < rects.length; i++) {
				const spr = rects[i].children[0];
				spr.y = -typeNum * 200 - 1;
				spr.x = 0;
				rects[i].width = 450;
				rects[i].invalidate();
				rects[i].hide();
			}
			rects[0].show();

			rects[0].x = 90 + scene.random.get(0, 10);
			rects[0].y = -200;
			rects[0].modified();
			timeline.create(rects[0]).moveTo(rects[0].x, 80, 300);

			line.show();

			sprMax.hide();
			sprMin.hide();
			labelSizes.forEach(e => e.hide());

			labelScore.hide();

			scene.labelStage.text = "" + stageNum + "/5";
			scene.labelStage.invalidate();

			labelSprit.show();
			labelSprit.text = "" + spritNum;
			labelSprit.invalidate();
			sprDiff.hide();
			sprMiss.hide();
			btnComp.show();

			sprTime.show();

			time = 0;

			isStop = false;
		};

		//リセット
		let isStop = false;
		this.reset = () => {
			isStop = true;
			typeNum = scene.random.get(0, 2);
			spritNum = 1;
			stageNum = 0;

			next();
		};

	}
}
