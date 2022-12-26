<script setup>
import NavbarComponent from '@/components/NavbarComponent.vue'
</script>

<template>
  <main class="bg-white min-h-screen dark:bg-slate-800">
    <div class="max-w-screen-xl mx-auto">
      <NavbarComponent />

      <div
        class="container mx-auto px-2 md:px-4 py-12 text-gray-700 dark:text-gray-300"
      >
        <div
          class="flex flex-col md:flex-row items-start relative h-full gap-6 md:gap:12 lg:gap-16"
        >
          <div class="w-full md:max-w-xs lg:max-w-sm md:sticky md:top-12">
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              On this page
            </h3>
            <ul
              class="space-y-1 list-disc list-inside text-gray-700 dark:text-gray-300 mb-12"
            >
              <li>
                <a
                  href="#prohibited-content"
                  class="text-blue-700 hover:underline dark:text-blue-400"
                  >Prohibited Content</a
                >
              </li>
              <li>
                <a
                  href="#acceptable-use"
                  class="text-blue-700 hover:underline dark:text-blue-400"
                  >Acceptable Use</a
                >
              </li>
              <li>
                <a
                  href="#reporting"
                  class="text-blue-700 hover:underline dark:text-blue-400"
                  >Reporting Non Compliant Content</a
                >
              </li>
              <li>
                <a
                  href="#privacy"
                  class="text-blue-700 hover:underline dark:text-blue-400"
                  >Privacy</a
                >
              </li>
              <li>
                <a
                  href="#copyright"
                  class="text-blue-700 hover:underline dark:text-blue-400"
                  >Intellectual Property and Copyright Infringement
                </a>
              </li>
              <li>
                <a
                  href="#personal-messages"
                  class="text-blue-700 hover:underline dark:text-blue-400"
                  >Personal Messages</a
                >
              </li>
              <li>
                <a
                  href="#enforcement"
                  class="text-blue-700 hover:underline dark:text-blue-400"
                  >Enforcement</a
                >
              </li>
              <li>
                <a
                  href="#appeals"
                  class="text-blue-700 hover:underline dark:text-blue-400"
                  >Appeals Process</a
                >
              </li>
              <li>
                <a
                  href="#contact"
                  class="text-blue-700 hover:underline dark:text-blue-400"
                  >Contact</a
                >
              </li>
            </ul>
          </div>
          <div class="flex-1">
            <h1
              class="text-5xl font-black leading-loose text-gray-900 dark:text-white mb-12"
            >
              Community Guidelines
            </h1>
            <p class="text-sm mb-12">Last updated: 12/12/2020</p>

            <p class="leading-loose mb-12">
              This document outlines the appropriate ways to interact on My
              Intellectual Space and the repercussions for failing to adhere to
              such. My Intellectual Space is a learning and education platform
              that thrives on productive, insightful communication between users
              of the site. Therefore, it becomes necessary to identify and
              enforce specific rules and guidelines regarding the acceptable use
              of the platform to ensure a consistent, lawful and enjoyable
              experience for all users. Continued use of My Intellectual Space
              is contingent upon your compliance with the below defined
              Community Guidelines and the associated
              <router-link
                to="/terms"
                class="text-blue-700 hover:underline dark:text-blue-400"
                >Terms of Service</router-link
              >.
            </p>

            <div id="prohibited-content" class="mb-12">
              <h3 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                1 - Prohibited Content
              </h3>
              <p class="leading-loose mb-4">
                In order to achieve its vision, My Intellectual Space allows
                users to share text and images with the community. Users should
                use their best judgment when deciding whether or not to share
                content. The following content types, regardless of the method
                of sharing are prohibited and will result in a permanent ban
                from the platform without prior warning.
              </p>
              <ul
                class="ml-4 space-y-1 list-disc list-inside text-gray-700 dark:text-gray-300"
              >
                <li>
                  Vulgar, defamatory, hateful, violent or otherwise offensive
                  content,
                </li>
                <li>Content that promotes or encourages illegal activity,</li>
                <li>Advocating suicide, or self-harm,</li>
                <li>Pornographic material either in text or images,</li>
                <li>
                  Personally identifying information (social security numbers,
                  full addresses, banking or credit card numbers, etc),
                </li>
                <li>Spam.</li>
              </ul>
            </div>

            <div id="acceptable-use" class="mb-12">
              <h3 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                2 - Acceptable Use
              </h3>
              <p class="leading-loose">
                Users are encouraged to share content that is educational in
                nature and promotes My Intellectual Space's vision. Content is
                not required to be educational and may highlight personal
                successes, failures, feats or general updates. Comments should
                add to the conversation, be nom-argumentative and not contain
                put-downs insults or otherwise violate section 1 of the
                community guidelines.
              </p>
            </div>

            <div id="reporting" class="mb-12">
              <h3 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                3 - Reporting Non Compliant Content
              </h3>
              <p class="leading-loose">
                We take reports very seriously. To report a post, you may click
                the flag icon on a post or personal message to view the
                reporting form. Reports may be filed for any post that violates
                these community guidelines. You should not report a post if it
                is compliant, but you simply disagree with or dislike its
                content. Prompt and appropriate action will be taken within 48
                hours of the filing of a report.Due to the number of reports we
                receive, you may not be updated on the disposition of the
                report. You may always block a user if the post is not removed
                and you no longer wish to view the particular user's content.
              </p>
            </div>

            <div id="privacy" class="mb-12">
              <h3 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                4 -Privacy
              </h3>
              <p class="leading-loose">
                My Intellectual Space is committed to protecting the privacy of
                its users. We will not share or sell your personal information
                with third parties without your consent. We will not use your
                personal information for marketing purposes without your
                consent. We will not use your personal information to target you
                with advertising on other websites. We will not use your
                personal information to target you with advertising via email,
                telephone, text message, postal mail, social media, television,
                radio, mobile or via any other methods without your consent.
              </p>
            </div>

            <div id="copyright" class="mb-12">
              <h3 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                5 - Intellectual Property and Copyright Infringement
              </h3>
              <p class="leading-loose">
                Take care to ensure that you have the necessary rights to share
                images you upload to the platform. Some content, particularly
                art, may be protected by federal copyright or other laws, and
                will require permission from the content owner prior to being
                shared publicly. If your post is removed for copyright
                Infringement, you will receive an Infringement notice emailed to
                the address on file. Users who accumulate an excessive amount of
                Infringement notices may be suspended or banned at the
                discretion of the administrators.
              </p>
            </div>

            <div id="personal-messages" class="mb-12">
              <h3 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                5 - Personal Messages
              </h3>
              <p class="leading-loose">
                Users may send and receive personal or private messages to
                others with whom they are connected with. Personal messages may
                be monitored by site administrators and are subject to the same
                guidelines defined in the above sections.
              </p>
            </div>

            <div id="enforcement" class="mb-12">
              <h3 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                6 - Enforcement
              </h3>
              <p class="leading-loose">
                My Intellectual Space reserves the right to remove any content
                that violates these guidelines. My Intellectual Space reserves
                the right to suspend or ban any user who violates these
                guidelines. My Intellectual Space reserves the right to modify
                these guidelines at any time with or without prior notice.
              </p>
            </div>

            <div id="appeals" class="mb-12">
              <h3 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                7 - Appeals Process
              </h3>
              <p class="leading-loose mb-4">
                If you believe that your content was removed in error, or your
                account was suspended, banned or disabled in error, you may
                appeal the decision by emailing
                <a
                  href="mailto:support@myintellectualspace.com"
                  class="text-blue-700 hover:underline dark:text-blue-400"
                  >support@myintellectualspace.com</a
                >. Please include the following information in your appeal:
              </p>
              <ul
                class="my-4 ml-4 space-y-1 list-disc list-inside text-gray-700 dark:text-gray-300"
              >
                <li>Your email address used at registration,</li>
                <li>
                  A description of the content that was removed (if applicable),
                </li>
                <li>The date of the removal or suspension,</li>
                <li>
                  A brief description of why you believe the content was removed
                  or your account was suspended, banned or disabled in error.
                </li>
              </ul>
              <p class="leading-loose">
                Please allow up to 7 business days for a us to investigate your
                claim and provide you with a response. Appeal decisions will be
                emailed to the address on file. If you do not receive a response
                within 7 business days, please contact us again. We will not
                respond to appeals that do not include the above information.
                Appeal decisions are final and may not be appealed further.
              </p>
            </div>

            <div id="contact" class="mb-12">
              <h3 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                8 - Contact
              </h3>
              <p class="leading-loose">
                If you have any questions or concerns regarding these
                guidelines, you may contact us at
                <a
                  href="mailto:support@myintellectualspace.com"
                  class="text-blue-700 hover:underline dark:text-blue-400"
                  >support@myintellectualspace.com</a
                >.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
