import mine from './buildTable.js'
import { paraFetchJSON } from './util.js'

const th = document.getElementById('th')
const tb = document.getElementById('tb')
const pvImg = document.getElementById('preview')

/* Handle preview buttons with a single event, rather than having hundreds: */
;(() => {
  let activeButton = null
  let activeButtonText
  function tbOnClick(event) {
    const tgt = event.target
    if (tgt.className != 'pv') return
    const imageSrc = tgt.parentElement.getElementsByTagName('a')[0].href
    pvImg.src = imageSrc

    /* When an image is loading, put overlay on preview image: */
    pvImg.classList.add('loading')

    /* Highlight the row of the selected item and add an search parameter to
     *  the URL: */
    const parentRow = tgt.parentElement.parentElement
    parentRow.classList.add('current-pv-row')

    const searchParams = new URLSearchParams(window.location.search)
    const rowID = parentRow.id
    if (searchParams.get('row') !== rowID) {
      searchParams.set('row', rowID)
      window.history.pushState({}, '', '?' + searchParams.toString())
    }

    /* Change the pressed button's text to "Loading" and restore the state of
     * the previously selected row/button: */
    if (activeButton !== null) {
      activeButton.innerText = activeButtonText
      activeButton.removeAttribute('disabled')
      activeButton.parentElement.parentElement.classList.remove(
        'current-pv-row',
      )
    }
    activeButtonText = tgt.innerText
    tgt.innerText = 'Loading'
    tgt.setAttribute('disabled', '')
    activeButton = tgt
  }
  tb.addEventListener('click', tbOnClick)
  /* When preview image loading finishes, remove overlay: */
  function onLoad() {
    pvImg.classList.remove('loading')
    if (activeButton === null) return
    activeButton.innerText = 'Current'
  }
  pvImg.addEventListener('load', onLoad)
})()

let lootData
let animalData

function isRowVisible(rowEle, minFractionToQualifyAsVisible = 0) {
  const tbCont = document.getElementById('table-cont')
  const contBounds = tbCont.getBoundingClientRect()
  const stickyHeader = tbCont.getElementsByTagName('thead')[0]
  const headerHeight = stickyHeader.getBoundingClientRect().height
  const rowBounds = rowEle.getBoundingClientRect()
  const rowHeight = rowBounds.height

  const pxBelowTop = rowBounds.bottom - (contBounds.top + headerHeight)
  if (pxBelowTop < 0) return false
  const pxAboveBot = contBounds.bottom - rowBounds.top
  if (pxAboveBot < 0) return false
  const visHeight = Math.min(rowHeight, pxBelowTop, pxAboveBot)
  return visHeight / rowHeight >= minFractionToQualifyAsVisible
}

/* Scroll search parameter target table row into view . */
function viewAnchoredRow() {
  if (location.search !== '') {
    const searchParams = new URLSearchParams(window.location.search)
    const target = document.getElementById(searchParams.get('row'))

    /* Row must be 100% visible to not trigger a scroll: */
    if (!isRowVisible(target, 1)) target.scrollIntoView({ block: 'center' })
    target.getElementsByClassName('pv')[0].click()
  }
}

;(async () => {
  const mapIDMap = await paraFetchJSON('./mapIDMap.json')
  mine('./lootData.json', mapIDMap)
    .then(rows => {
      th.appendChild(rows.header)
      tb.append(...rows.body)
    })
    .catch(err => {
      console.error('Error fetching data to build table!')
      console.error({ err })
    })
  viewAnchoredRow()
})()

// window.addEventListener('hashchange', viewAnchoredRow);
window.addEventListener('popstate', viewAnchoredRow)
