$(function () {
	$('#dock').Fisheye(
		{
			maxWidth: 70,
			items: 'a',
			itemsText: 'span',
			container: '.dock-container',
			itemWidth: 100,
			proximity: 100,
			alignment : 'left',
			valign: 'bottom',
			halign : 'center'
		}
	);
});