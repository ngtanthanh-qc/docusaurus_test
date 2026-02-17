module.exports = function recentBlogPostsPlugin() {
  return {
    name: 'recent-blog-posts',
    async allContentLoaded({allContent, actions}) {
      const blogPluginContent =
        allContent['docusaurus-plugin-content-blog']?.default;

      if (!blogPluginContent) {
        return;
      }

      const recentPosts = blogPluginContent.blogPosts
        .filter((post) => !post.metadata.unlisted)
        .slice(0, 4)
        .map((post) => ({
          title: post.metadata.title,
          description: post.metadata.description,
          date: post.metadata.date,
          formattedDate: post.metadata.formattedDate,
          permalink: post.metadata.permalink,
          readingTime: post.metadata.readingTime,
          tags: post.metadata.tags.map((tag) => ({
            label: tag.label,
            permalink: tag.permalink,
          })),
        }));

      actions.setGlobalData({recentPosts});
    },
  };
};
