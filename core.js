
/**
 * 将数字转换为具体的牌
 * @param {Number} num 数字
 */
function numToCard(num) {
    var typeNum, digitalNum
    typeNum = num % 4
    digitalNum = Math.floor(num / 4) + 1
    return {
        type: typeNum,
        num: digitalNum
    }
}

/**
 * 将具体的牌转换为数字
 * @param {Object} card 牌
 */
function cardToNum(card) {
    var typeNum, digitalNum
    typeNum = card.type
    digitalNum = card.num
    return (digitalNum - 1) * 4 + typeNum
}

/**
 * 判断是否存在同花
 * @param {Array} cards 一组牌
 */
function ifSameColor(cards) {
    var card
    var flag = {
        0: [],
        1: [],
        2: [],
        3: []
    }
	var cards = JSON.parse(JSON.stringify(cards))
    cards.sort(function(a, b) {
        return a.num - b.num
    })
    while(card = cards.pop()) {
        flag[card.type].push(card)
        if(flag[card.type].length === 5) {
            return flag[card.type]
        }
    }
    return false
}

/**
 * 判断是否存在连续牌
 * @param {Array} cards 一组牌
 */
function ifSeries(cards) {
    var cardArr = []
	var cards = JSON.parse(JSON.stringify(cards))
    cards.sort(function(a, b) {
        return a.num - b.num
    })   
    cardArr.push(cards[cards.length-1])
    for(var i=cards.length-2; i>=0; i--) {
        if (cardArr[cardArr.length-1].num - cards[i].num !== 1) {
			if (cardArr[cardArr.length-1].num !== cards[i].num) {
            	cardArr = []
				cardArr.push(cards[i])
			} 
        } else {
			cardArr.push(cards[i])
		}
		if (cardArr.length === 5) return cardArr
    }
    return false    
}

/**
 * 对相同数字的牌归类
 * @param {Array} cards 一组牌
*/
function classify(cards) {
    var flag = {}
	var cards = JSON.parse(JSON.stringify(cards))
    cards.forEach(function(card) {
        (flag[card.num] || (flag[card.num] = [])).push(card)
    })
    return flag
}

/**
 * 判断是否存在于数组中
 * @param {Array} arr 数组
 * @param {Object} obj 待判断元素
 */
function ifExistArr(arr, obj){
    for (var i=0; i<arr.length; i++) {
        if (JSON.stringify(obj) === JSON.stringify(arr[i])) {
            return true
        }
    }
    return false
}

/**
 * 过滤数组  并取得过滤后的最大值
 * @param {Array} pArr 待过滤数组
 */
function filterArr(pArr) {
	var pArr = JSON.parse(JSON.stringify(pArr))
    var filtedArr = []
    var cArr = [];
    var tempArr = [].slice.call(arguments)
    for (var i=1; i<tempArr.length; i++) {
        tempArr[i].forEach(function(v) {
            cArr.push(v)
        })
    }
    pArr.forEach(function(pItem) {
        if (!ifExistArr(cArr, pItem)) {
            filtedArr.push(pItem)
        }
    })
    filtedArr.sort(function(a, b) {
        return a.num - b.num
    })
    return filtedArr.slice(-1)[0]
}

/**
 * 是否为四条
 * @param {Array} cards
 */
function isFour(cards) {
	var cards = JSON.parse(JSON.stringify(cards))
    var result = classify(cards)
    var keys = Object.keys(result)
	var temp
	for (var i=0; i<keys.length; i++) {
        if (result[keys[i]].length == 4) {
			temp = filterArr(cards, result[keys[i]])
            result[keys[i]].push(temp)
			return {
				cards: result[keys[i]],
				pairCardNum: keys[i],
				singleCard: temp
			}
        }
	}
    return false
} 

/**
 * 是否为Fullhouse
 * @param {Array} cards
 */
function isFullHouse(cards) {
	var cards = JSON.parse(JSON.stringify(cards))
    var result = classify(cards)
	var keys = Object.keys(result)
	var tempArr = []
	var three = []
	var two = []
	keys.sort(function(a, b) {
		return a - b
	})	
	for (var i=keys.length-1; i>=0; i--) {
		if (result[keys[i]].length == 3) {
			three = result[keys[i]]
			delete result[keys[i]]
			keys.splice(i, 1)
			break
		}
	}
	if (i === -1) return false
	for (i=keys.length-1; i>=0; i--) {
		if (result[keys[i]].length >= 2) {
			result[keys[i]].sort(function(a, b){
				return a.type - b.type
			})
			two = result[keys[i]].slice(0, 2)
			tempArr = three.concat(two)
			return {
				cards: tempArr,
				three: three,
				two : two
			}
		}
	}
	if (i === -1) return false
}

/**
 * 是否为三条
 * @param {Array} cards 一组牌
 */
function isThree(cards) {
	var cards = JSON.parse(JSON.stringify(cards))
    var result = classify(cards)
	var keys = Object.keys(result)
	var tempArr = []
	var three = []
	var two = []
	keys.sort(function(a, b) {
		return a - b
	})	
	for (var i=keys.length-1; i>=0; i--) {
		if (result[keys[i]].length == 3) {
			three = result[keys[i]]
			delete result[keys[i]]
			keys.splice(i, 1)
			break
		}
	}
	if (i === -1) return false
	for (var i=keys.length-1, j=0; i>=0; i--, j++) {
		two = two.concat(result[keys[i]])
		if (j == 1) {
			tempArr = three.concat(two)
			return {
				cards: tempArr,
				three: three,
				two: two
			}
		}
	}
}

/**
 * 是否为两对
 * @param {Array} cards
 */
function isTwoPairs(cards) {
	var cards = JSON.parse(JSON.stringify(cards))
    var result = classify(cards)
	var keys = Object.keys(result)
	var tempArr = []
	var bPair = []
	var sPair = []
	var single
	keys.sort(function(a, b) {
		return a - b
	})	
	for (var i=keys.length-1; i>=0; i--) {
		if (result[keys[i]].length == 2) {
			bPair = result[keys[i]]
			delete result[keys[i]]
			keys.splice(i, 1)
			break
		}
	}
	if (i === -1) return false
	for (i=keys.length-1; i>=0; i--) {
		if (result[keys[i]].length == 2) {
			sPair = result[keys[i]]
			delete result[keys[i]]
			keys.splice(i, 1)
			break
		}
	}
	if (i === -1) return false
	result[keys[keys.length-1]].sort(function(a, b){
		return a.type - b.type
	})
	single = result[keys[keys.length-1]][0]
	tempArr = bPair.concat(sPair).concat(single)
	return {
		cards: tempArr,
		bPair: bPair,
		sPair: sPair,
		single: single
	}
}

/**
 * 是否为一对
 * @param {Array} cards
 */
function isOnePairs(cards) {
	var cards = JSON.parse(JSON.stringify(cards))
    var result = classify(cards)
	var keys = Object.keys(result)
	var tempArr = []
	var two = []
	var single = []
	keys.sort(function(a, b) {
		return a - b
	})	
	for (var i=keys.length-1; i>=0; i--) {
		if (result[keys[i]].length == 2) {
			two = result[keys[i]]
			delete result[keys[i]]
			keys.splice(i, 1)
			break
		}
	}
	if (i === -1) return false
	for(var i=keys.length-1, j=0; i>=0; i--, j++) {
		single = single.concat(result[keys[i]])
		if (j == 2) {
			tempArr = two.concat(single)
			return {
				cards: tempArr,
				two: two,
				single: single
			}
		}
	}
}
/**
 * 判断牌型
 * @param {Array} cards 一组牌
 */
function cardsType(cards) {
	var cards = JSON.parse(JSON.stringify(cards))
    if(cards.length < 5) return 
    //同花顺 
    if(ifSeries(cards) && ifSameColor(cards) && (JSON.stringify(ifSeries(cards)) == JSON.stringify(ifSameColor(cards)))) {
		//level 1   同花大顺
        if(ifSeries(cards)[0].num === 13){
            return {
                level: 1,
                cards: ifSeries(cards)
            }
        //level 2   同花顺
        }else {
            return {
                level: 2,
                cards: ifSeries(cards)
            }            
        }
    }
	//四条
	if(isFour(cards)) {
		return {
			level: 3,
			cards: isFour(cards)
		}
	}
	//满堂红
	if(isFullHouse(cards)) {
		return {
			level: 4,
			cards: isFullHouse(cards)
		}
	}
	//同花
	if(ifSameColor(cards)) {
		return {
			level: 5,
			cards: ifSameColor(cards)
		}
	}
	//顺子
	if(ifSeries(cards)) {
		return {
			level: 6,
			cards: ifSeries(cards)
		}
	}
	//三条
	if(isThree(cards)) {
		return {
			level: 7,
			cards: isThree(cards)
		}
	}
	//两对
	if(isTwoPairs(cards)) {
		return {
			level: 8,
			cards: isTwoPairs(cards)
		}
	}
	//一对
	if(isOnePairs(cards)) {
		return {
			level: 9,
			cards: isOnePairs(cards)
		}
	}
	//高牌
	return {
		level: 10,
		cards: cards.sort(function(a, b) {
			return b.num - a.num
		}).slice(0, 5)
	}
}

/**
 * 相同level比较大小
 */
function compareLevel1(a, b) {
	return a.cards[0].type - b.cards[0].type
}

function compareLevel2(a, b) {
	if (a.cards[0].num !== b.cards[0].num) {
		return b.cards[0].num - a.cards[0].num
	} else {
		return a.cards[0].type - b.cards[0].type
	}
}

function compareLevel3(a, b) {
	if (a.cards.pairCardNum !== b.cards.pairCardNum) {
		return b.cards.pairCardNum - a.cards.pairCardNum
	} else {
		if (a.cards.singleCard.num !== b.cards.singleCard.num) {
			return b.cards.singleCard.num - a.cards.singleCard.num
		}else {
			return a.cards.singleCard.type - b.cards.singleCard.type
		}
	}
}

function compareLevel4(a, b) {
	if (a.cards.three[0].num !== b.cards.three[0].num) {
		return b.cards.three[0].num - a.cards.three[0].num
	} else {
		return b.cards.two[0].num - a.cards.two[0].num
	}
}

function compareLevel5(a, b) {
	for(var i=0; i<a.cards.length; i++) {
		if (a.cards[i].num !== b.cards[i].num) {
			return b.cards[i].num - a.cards[i].num
		}
	}
	return a.cards[0].type - b.cards[0].type
}

function compareLevel6(a, b) {
	if (a.cards[0].num !== b.cards[0].num) {
		return b.cards[0].num - a.cards[0].num
	}
	for(var i=0; i<a.cards.length; i++) {
		if (a.cards[i].type !== b.cards[i].type) {
			return a.cards[i].type - b.cards[i].type
		}
	}	
}

function compareLevel7(a, b) {
	if (a.cards.cards[0].num !== b.cards.cards[0].num) {
		return b.cards.cards[0].num - a.cards.cards[0].num
	}
	for(var i=0; i<a.cards.two.length; i++) {
		if (a.cards.two[i].num !== b.cards.two[i].num) {
			return b.cards.two[i].num - a.cards.two[i].num
		}
	}
}

function compareLevel8(a, b) {
	if (a.cards.bPair[0].num !== b.cards.bPair[0].num) {
		return b.cards.bPair[0].num - a.cards.bPair[0].num
	}
	if (a.cards.sPair[0].num !== b.cards.sPair[0].num) {
		return b.cards.sPair[0].num - a.cards.sPair[0].num
	}
	return b.cards.single.num - a.cards.single.num
}

function compareLevel9(a, b) {
	if (a.cards.two[0].num !== b.cards.two[0].num) {
		return b.cards.two[0].num - a.cards.two[0].num
	}
	for (var i=0; i<a.cards.single.length; i++) {
		if (a.cards.single[i].num !== b.cards.single[i].num) {
			return b.cards.single[i].num - a.cards.single[i].num
		}
	}
}

function compareLevel10(a, b) {
	for (var i=0; i<a.cards.length; i++) {
		if (a.cards[i].num !== b.cards[i].num) {
			return b.cards[i].num - a.cards[i].num
		}
	}	
}
/**
 * 比较大小
 */
function sortCards() {
	//var cardsArr = [].slice.call(arguments)
	var cardsArr = []
	arguments[0].forEach(function (item) {
		cardsArr.push(item)
	})
	cardsArr.sort(function(a, b) {
		if(a.level !== b.level) {
			return a.level - b.level
		}else {
			switch(a.level) {
				case 1:
					return compareLevel1(a, b)
				case 2:
					return compareLevel2(a, b)
				case 3: 
					return compareLevel3(a, b)
				case 4: 
					return compareLevel4(a, b)
				case 5: 
					return compareLevel5(a, b)
				case 6: 
					return compareLevel6(a, b)
				case 7: 
					return compareLevel7(a, b)
				case 8: 
					return compareLevel8(a, b)
				case 9: 
					return compareLevel9(a, b)
				case 10: 
					return compareLevel10(a, b)
			}
		}
	})
	return cardsArr
}