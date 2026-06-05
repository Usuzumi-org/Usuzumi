export function assertConsumerNavigationFeedbackResult(value) {
if (value.menuOpenAnimation !== 'uzu-menu-in' || value.menuCloseAnimation !== 'uzu-menu-out' || value.menuExpandedAfterOpen !== 'true') throw new Error('Browser consumer menu behavior did not work');
if (!value.contextMenuOpen || value.contextMenuLeft < 8) throw new Error('Browser consumer context menu did not open at a clamped position');
if (value.menubarActiveValue !== 'edit') throw new Error('Browser consumer menubar did not update active item');
if (value.commandVisibleCount !== 1) throw new Error('Browser consumer command filtering did not narrow results');
if (value.stepNavValue !== 'review' || value.stepNavReviewCurrent !== 'step') throw new Error('Browser consumer step navigation did not update current step');
if (value.accordionFirstOpen || !value.accordionSecondOpen) throw new Error('Browser consumer accordion did not keep one panel open');
if (!value.hoverCardOpen) throw new Error('Browser consumer hover card did not open on focus');
if (value.tagSelectablePressed !== 'false' || !value.tagCloseableHidden) throw new Error('Browser consumer tag behavior did not work');
if (value.progressAnimation !== 'uzu-progress-indeterminate') throw new Error('Browser consumer CSS did not animate indeterminate progress');
if (value.activityAnimation !== 'uzu-activity-dot') throw new Error('Browser consumer CSS did not animate activity dots');
if (value.processAnimation !== 'uzu-process-pulse') throw new Error('Browser consumer CSS did not animate active process steps');
if (value.spinnerAnimation !== 'uzu-spin') throw new Error('Browser consumer spinner animation is missing');
if (value.skeletonCardDisplay !== 'grid' || value.skeletonAvatarWidth !== 40 || value.skeletonAvatarHeight !== 40 || value.skeletonMediaHeight < 100 || value.skeletonLineAnimation !== 'uzu-skeleton' || Number.parseFloat(value.skeletonLineAnimationDuration) < 2.15 || Number.parseFloat(value.skeletonLineAnimationDuration) > 2.25 || value.skeletonLineAnimationTiming !== 'cubic-bezier(0.2, 0.8, 0.2, 1)' || value.skeletonLineShimmerAnimation !== 'uzu-skeleton-shimmer' || Number.parseFloat(value.skeletonLineShimmerDuration) < 1.45 || Number.parseFloat(value.skeletonLineShimmerDuration) > 1.55 || value.skeletonLineShimmerPosition !== 'absolute' || !value.skeletonLineShimmerBackgroundImage.includes('linear-gradient')) throw new Error('Browser consumer skeleton card, media, avatar, or shimmer styling is missing');
if (value.listBorderStyle === 'none' || value.listItemDisplay !== 'grid') throw new Error('Browser consumer list styling is missing');
if (value.avatarWidth !== 36 || value.avatarHeight !== 36 || value.avatarDisplay !== 'inline-flex') throw new Error('Browser consumer avatar metrics are wrong');
if (value.sidebarDisplay !== 'grid' || value.sidebarWidth !== 240) throw new Error('Browser consumer sidebar metrics are wrong');
if (value.sidebarLayoutColumnGap !== '28px') throw new Error('Browser consumer sidebar layout default gap is wrong');
if (value.tagStaticDisplay !== 'inline-flex') throw new Error('Browser consumer tag display is wrong');
if (value.emptyStateDisplay !== 'grid' || !value.errorStateColor) throw new Error('Browser consumer empty/error state styling is missing');
}
