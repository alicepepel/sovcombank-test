const days = Array.from(document.querySelectorAll('.day:not(.day--disabled)'));
const calendar = document.querySelector('.calendar');

let clickCount = 0;
let firstSelectedIndex = null;
let secondSelectedIndex = null;

function resetClasses() {
    days.forEach(day => {
        day.classList.remove('day--active', 'day--in', 'day--off', 'day--intermediate');
    });
    clickCount = 0;
    firstSelectedIndex = null;
    secondSelectedIndex = null;
}

calendar.addEventListener('click', function (e) {
    const target = e.target.closest('.day:not(.day--disabled)');
    if (!target) return;

    const index = days.indexOf(target);

    if (clickCount === 0) {
        resetClasses();
        target.classList.add('day--active');
        firstSelectedIndex = index;
        clickCount = 1;
    } else if (clickCount === 1) {
        target.classList.add('day--active');
        secondSelectedIndex = index;

        const [start, end] = [firstSelectedIndex, secondSelectedIndex].sort((a, b) => a - b);

        days[firstSelectedIndex].classList.add('day--in');
        days[secondSelectedIndex].classList.add('day--off');

        for (let i = start + 1; i < end; i++) {
            days[i].classList.add('day--intermediate');
        }

        clickCount = 2;
    } else {
        resetClasses();
    }
});

const themesButton = document.querySelector('.themes-button');
const mainContainer = document.querySelector('.main');
themesButton.addEventListener('click', function (){
    if(mainContainer.classList.contains('light-theme')) {
        mainContainer.setAttribute('class', 'main dark-theme');
        themesButton.textContent = 'Try light theme';
    } else {
        mainContainer.setAttribute('class', 'main light-theme');
        themesButton.textContent = 'Try dark theme';
    }
})