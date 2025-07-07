<?php
/**
 * Title: archive
 * Slug: dt-the7/hidden-archive
 * Inserter: no
 */
?>
<!-- wp:template-part {"slug":"header","tagName":"header"} /-->

<!-- wp:group {"metadata":{"name":"Archive Title"},"style":{"spacing":{"padding":{"top":"0px","bottom":"0px"},"margin":{"top":"0","bottom":"0"},"blockGap":"0"},"dimensions":{"minHeight":""},"elements":{"link":{"color":{"text":"var:preset|color|contrast-content"}}},"border":{"radius":"0px"}},"backgroundColor":"contrast-background","textColor":"contrast-content","layout":{"type":"constrained","contentSize":"","wideSize":""}} -->
<div class="wp-block-group has-contrast-content-color has-contrast-background-background-color has-text-color has-background has-link-color" style="border-radius:0px;margin-top:0;margin-bottom:0;padding-top:0px;padding-bottom:0px"><!-- wp:group {"metadata":{"name":"Title Min Width + Vertical Paddings"},"style":{"dimensions":{"minHeight":"0px"},"spacing":{"blockGap":"var:preset|spacing|46","padding":{"top":"var:preset|spacing|81","bottom":"var:preset|spacing|81"}}},"layout":{"type":"flex","orientation":"vertical","verticalAlignment":"center","justifyContent":"center"}} -->
<div class="wp-block-group" style="min-height:0px;padding-top:var(--wp--preset--spacing--81);padding-bottom:var(--wp--preset--spacing--81)"><!-- wp:query-title {"type":"archive","textAlign":"center","showPrefix":false,"style":{"elements":{"link":{"color":{"text":"var:preset|color|contrast-headings"}}}},"textColor":"contrast-headings","fontSize":"6-x-large"} /-->

<!-- wp:term-description {"textAlign":"center","style":{"elements":{"link":{"color":{"text":"var:preset|color|contrast-content"}}}},"textColor":"contrast-content","fontSize":"medium"} /--></div>
<!-- /wp:group --></div>
<!-- /wp:group -->

<!-- wp:group {"metadata":{"name":"Posts"},"align":"wide","style":{"spacing":{"padding":{"top":"var:preset|spacing|91","bottom":"var:preset|spacing|91"},"blockGap":"0"}},"layout":{"type":"default"}} -->
<div class="wp-block-group alignwide" style="padding-top:var(--wp--preset--spacing--91);padding-bottom:var(--wp--preset--spacing--91)"><!-- wp:query {"queryId":28,"query":{"perPage":4,"pages":0,"offset":"0","postType":"post","order":"desc","orderBy":"date","author":"","search":"","exclude":[],"sticky":"exclude","inherit":true},"metadata":{"categories":["blog"],"patternName":"core/block/1006"},"align":"wide","layout":{"type":"default"}} -->
<div class="wp-block-query alignwide"><!-- wp:group {"align":"wide","style":{"spacing":{"blockGap":"var:preset|spacing|80"}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group alignwide"><!-- wp:query-no-results {"align":"wide"} -->
<!-- wp:paragraph -->
<p>No posts were found.</p>
<!-- /wp:paragraph -->
<!-- /wp:query-no-results -->

<!-- wp:post-template {"align":"wide","style":{"spacing":{"blockGap":"var:preset|spacing|81"}},"layout":{"type":"grid","columnCount":2,"minimumColumnWidth":null},"dtCrStackOn":{"breakpoint":"tablet"}} -->
<!-- wp:group {"metadata":{"name":"Post"},"style":{"spacing":{"blockGap":"var:preset|spacing|45"}},"layout":{"type":"default"}} -->
<div class="wp-block-group"><!-- wp:post-featured-image {"isLink":true,"aspectRatio":"16/9","width":"100%","height":"","style":{"color":{"duotone":"unset"},"layout":{"selfStretch":"fill","flexSize":null},"spacing":{"margin":{"bottom":"var:preset|spacing|46"}}}} /-->

<!-- wp:group {"metadata":{"name":"Post Info"},"style":{"spacing":{"blockGap":"var:preset|spacing|40"}},"layout":{"type":"flex","flexWrap":"nowrap","justifyContent":"left"}} -->
<div class="wp-block-group"><!-- wp:post-terms {"term":"category","style":{"elements":{"link":{"color":{"text":"var:preset|color|accent-1"},":hover":{"color":{"text":"var:preset|color|accent-1-dark"}}}}},"textColor":"accent-1","fontSize":"x-small"} /-->

<!-- wp:post-date {"style":{"elements":{"link":{"color":{"text":"var:preset|color|content-2"}}}},"textColor":"content-2","fontSize":"x-small"} /--></div>
<!-- /wp:group -->

<!-- wp:post-title {"level":3,"isLink":true} /-->

<!-- wp:post-excerpt {"moreText":"","showMoreOnNewLine":false,"excerptLength":30,"fontSize":"small"} /-->

<!-- wp:read-more {"content":"Read Article"} /--></div>
<!-- /wp:group -->
<!-- /wp:post-template -->

<!-- wp:query-pagination {"paginationArrow":"arrow","align":"wide","layout":{"type":"flex","justifyContent":"space-between","orientation":"horizontal","flexWrap":"wrap"}} -->
<!-- wp:query-pagination-previous {"label":"Previous Page"} /-->

<!-- wp:query-pagination-next {"label":"Next Page"} /-->
<!-- /wp:query-pagination --></div>
<!-- /wp:group --></div>
<!-- /wp:query --></div>
<!-- /wp:group -->

<!-- wp:template-part {"slug":"footer","tagName":"footer"} /-->